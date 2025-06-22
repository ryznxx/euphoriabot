import { initReply } from "./src/handlers/reply.handler";
import { newMessage } from "./src/handlers/newMessage";
import { Boom } from "@hapi/boom";
import readline from "readline";
import makeWASocket, {
   AnyMessageContent,
   BinaryInfo,
   delay,
   DisconnectReason,
   downloadAndProcessHistorySyncNotification,
   encodeWAM,
   fetchLatestBaileysVersion,
   getAggregateVotesInPollMessage,
   getHistoryMsg,
   isJidNewsletter,
   makeCacheableSignalKeyStore,
   proto,
   useMultiFileAuthState,
   WAMessageContent,
   WAMessageKey,
} from "baileys";
import P from "pino";

const logger = P(
   { timestamp: () => `,"time":"${new Date().toJSON()}"` },
   P.destination("./wa-logs.txt")
);
logger.level = "trace";

const doReplies = process.argv.includes("--do-reply");
const usePairingCode = process.argv.includes("--use-pairing-code");

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
});
const question = (text: string) =>
   new Promise<string>((resolve) => rl.question(text, resolve));

const startSock = async () => {
   const { state, saveCreds } = await useMultiFileAuthState("session");
   const { version, isLatest } = await fetchLatestBaileysVersion();

   const sock = makeWASocket({
      version,
      logger,
      printQRInTerminal: !usePairingCode,
      auth: {
         creds: state.creds,
         /** caching makes the store faster to send/recv messages */
         keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      generateHighQualityLinkPreview: true,
      // ignore all broadcast messages -- to receive the same
      // comment the line below out
      // shouldIgnoreJid: jid => isJidBroadcast(jid),
      // implement to handle retries & poll updates
      getMessage,
   });

   // Pairing code for Web clients
   if (usePairingCode && !sock.authState.creds.registered) {
      // todo move to QR event
      const phoneNumber = await question("Please enter your phone number:\n");
      const code = await sock.requestPairingCode(phoneNumber);
      console.log(`Pairing code: ${code}`);
   }

   const sendMessageWTyping = async (msg: AnyMessageContent, jid: string) => {
      await sock.presenceSubscribe(jid);
      await delay(500);

      await sock.sendPresenceUpdate("composing", jid);
      await delay(2000);

      await sock.sendPresenceUpdate("paused", jid);

      await sock.sendMessage(jid, msg);
   };

   sock.ev.process(async (events) => {
      if (events["connection.update"]) {
         const update = events["connection.update"];
         const { connection, lastDisconnect } = update;
         if (connection === "close") {
            // reconnect if not logged out
            if (
               (lastDisconnect?.error as Boom)?.output?.statusCode !==
               DisconnectReason.loggedOut
            ) {
               startSock();
            } else {
               console.log("Connection closed. You are logged out.");
            }
         }
         if (update.connection === "connecting") {
            console.clear();
            console.log("Mencoba untuk menghubungkan socket ke whatsapp");
         } else if (update.connection === "open") {
            console.clear();
            console.log("Socket terhubung dengan whatsapp");
            console.log("Bot siap digunakan, menunggu aksi clients :)");
         } else {
            console.log("Socket gagal terhubung");
         }
      }

      if (events["creds.update"]) {
         await saveCreds();
      }

      if (events["labels.association"]) {
         console.log(events["labels.association"]);
      }

      if (events["labels.edit"]) {
         console.log(events["labels.edit"]);
      }

      if (events.call) {
         console.log("recv call event", events.call);
      }

      // history received
      // if (events["messaging-history.set"]) {
      //    const { chats, contacts, messages, isLatest, progress, syncType } =
      //       events["messaging-history.set"];
      //    if (syncType === proto.HistorySync.HistorySyncType.ON_DEMAND) {
      //       console.log(
      //          "received on-demand history sync, messages=",
      //          messages
      //       );
      //    }
      //    console.log(
      //       `recv ${chats.length} chats, ${contacts.length} contacts, ${messages.length} msgs (is latest: ${isLatest}, progress: ${progress}%), type: ${syncType}`
      //    );
      // }

      // received a new message
      if (events["messages.upsert"]) {
         const upsert = events["messages.upsert"];
         // console.log("recv messages ", JSON.stringify(upsert, undefined, 2));

         if (upsert.type === "notify") {
            for (const msg of upsert.messages) {
               await newMessage(msg);
               //TODO: More built-in implementation of this
               /* if (
							msg.message?.protocolMessage?.type ===
							proto.Message.ProtocolMessage.Type.HISTORY_SYNC_NOTIFICATION
						  ) {
							const historySyncNotification = getHistoryMsg(msg.message)
							if (
							  historySyncNotification?.syncType ==
							  proto.HistorySync.HistorySyncType.ON_DEMAND
							) {
							  const { messages } =
								await downloadAndProcessHistorySyncNotification(
								  historySyncNotification,
								  {}
								)


								const chatId = onDemandMap.get(
									historySyncNotification!.peerDataRequestSessionId!
								)

								console.log(messages)

							  onDemandMap.delete(
								historySyncNotification!.peerDataRequestSessionId!
							  )

							  /*
								// 50 messages is the limit imposed by whatsapp
								//TODO: Add ratelimit of 7200 seconds
								//TODO: Max retries 10
								const messageId = await sock.fetchMessageHistory(
									50,
									oldestMessageKey,
									oldestMessageTimestamp
								)
								onDemandMap.set(messageId, chatId)
							}
						  } */

               if (
                  msg.message?.conversation ||
                  msg.message?.extendedTextMessage?.text
               ) {
                  const text =
                     msg.message?.conversation ||
                     msg.message?.extendedTextMessage?.text;

                  if (text == "requestPlaceholder" && !upsert.requestId) {
                     const messageId = await sock.requestPlaceholderResend(
                        msg.key
                     );
                     console.log(
                        "requested placeholder resync, id=",
                        messageId
                     );
                  } else if (upsert.requestId) {
                     console.log(
                        "Message received from phone, id=",
                        upsert.requestId,
                        msg
                     );
                  }

                  if (text == "onDemandHistSync") {
                     const messageId = await sock.fetchMessageHistory(
                        50,
                        msg.key,
                        msg.messageTimestamp!
                     );
                     console.log("requested on-demand sync, id=", messageId);
                  }
               }

               if (
                  !msg.key.fromMe &&
                  doReplies &&
                  !isJidNewsletter(msg.key?.remoteJid!)
               ) {
                  await sock!.readMessages([msg.key]);
               }
            }
         }
      }

      // messages updated like status delivered, message deleted etc.
      if (events["messages.update"]) {
         // console.log(
         //    JSON.stringify(events["messages.update"], undefined, 2)
         // );

         for (const { key, update } of events["messages.update"]) {
            if (update.pollUpdates) {
               const pollCreation: proto.IMessage = {}; // get the poll creation message somehow
               if (pollCreation) {
                  console.log(
                     "got poll update, aggregation: ",
                     getAggregateVotesInPollMessage({
                        message: pollCreation,
                        pollUpdates: update.pollUpdates,
                     })
                  );
               }
            }
         }
      }

      // if (events["message-receipt.update"]) {
      //    console.log(events["message-receipt.update"]);
      // }

      if (events["messages.reaction"]) {
         console.log(events["messages.reaction"]);
      }

      // if (events["presence.update"]) {
      //    console.log(events["presence.update"]);
      // }

      // if (events["chats.update"]) {
      //    console.log(events["chats.update"]);
      // }

      // if (events["contacts.update"]) {
      //    for (const contact of events["contacts.update"]) {
      //       if (typeof contact.imgUrl !== "undefined") {
      //          const newUrl =
      //             contact.imgUrl === null
      //                ? null
      //                : await sock!
      //                     .profilePictureUrl(contact.id!)
      //                     .catch(() => null);
      //          console.log(
      //             `contact ${contact.id} has a new profile pic: ${newUrl}`
      //          );
      //       }
      //    }
      // }

      if (events["chats.delete"]) {
         console.log("chats deleted ", events["chats.delete"]);
      }
   });
   initReply(sock);
   return sock;

   async function getMessage(
      key: WAMessageKey
   ): Promise<WAMessageContent | undefined> {
      // Implement a way to retreive messages that were upserted from messages.upsert
      // up to you

      // only if store is present
      return proto.Message.fromObject({});
   }
};

startSock();
