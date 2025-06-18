"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const newMessage_1 = require("./src/handler/newMessage");
const readline_1 = __importDefault(require("readline"));
const baileys_1 = __importStar(require("baileys"));
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)({ timestamp: () => `,"time":"${new Date().toJSON()}"` }, pino_1.default.destination("./wa-logs.txt"));
logger.level = "trace";
const doReplies = process.argv.includes("--do-reply");
const usePairingCode = process.argv.includes("--use-pairing-code");
// external map to store retry counts of messages when decryption/encryption fails
// keep this out of the socket itself, so as to prevent a message decryption/encryption loop across socket restarts
// const msgRetryCounterCache = new NodeCache();
// const onDemandMap = new Map<string, string>();
// Read line interface
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const question = (text) => new Promise((resolve) => rl.question(text, resolve));
// start a connection
const startSock = () => __awaiter(void 0, void 0, void 0, function* () {
    const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)("baileys_auth_info");
    // fetch latest version of WA Web
    const { version, isLatest } = yield (0, baileys_1.fetchLatestBaileysVersion)();
    // console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);
    const sock = (0, baileys_1.default)({
        version,
        logger,
        printQRInTerminal: !usePairingCode,
        auth: {
            creds: state.creds,
            /** caching makes the store faster to send/recv messages */
            keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
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
        const phoneNumber = yield question("Please enter your phone number:\n");
        const code = yield sock.requestPairingCode(phoneNumber);
        console.log(`Pairing code: ${code}`);
    }
    const sendMessageWTyping = (msg, jid) => __awaiter(void 0, void 0, void 0, function* () {
        yield sock.presenceSubscribe(jid);
        yield (0, baileys_1.delay)(500);
        yield sock.sendPresenceUpdate("composing", jid);
        yield (0, baileys_1.delay)(2000);
        yield sock.sendPresenceUpdate("paused", jid);
        yield sock.sendMessage(jid, msg);
    });
    // the process function lets you process all events that just occurred
    // efficiently in a batch
    sock.ev.process(
    // events is a map for event name => event data
    (events) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        // something about the connection changed
        // maybe it closed, or we received all offline message or connection opened
        if (events["connection.update"]) {
            const update = events["connection.update"];
            const { connection, lastDisconnect } = update;
            if (connection === "close") {
                // reconnect if not logged out
                if (((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !==
                    baileys_1.DisconnectReason.loggedOut) {
                    startSock();
                }
                else {
                    console.log("Connection closed. You are logged out.");
                }
            }
            // WARNING: THIS WILL SEND A WAM EXAMPLE AND THIS IS A ****CAPTURED MESSAGE.****
            // DO NOT ACTUALLY ENABLE THIS UNLESS YOU MODIFIED THE FILE.JSON!!!!!
            // THE ANALYTICS IN THE FILE ARE OLD. DO NOT USE THEM.
            // YOUR APP SHOULD HAVE GLOBALS AND ANALYTICS ACCURATE TO TIME, DATE AND THE SESSION
            // THIS FILE.JSON APPROACH IS JUST AN APPROACH I USED, BE FREE TO DO THIS IN ANOTHER WAY.
            // THE FIRST EVENT CONTAINS THE CONSTANT GLOBALS, EXCEPT THE seqenceNumber(in the event) and commitTime
            // THIS INCLUDES STUFF LIKE ocVersion WHICH IS CRUCIAL FOR THE PREVENTION OF THE WARNING
            // const sendWAMExample = false;
            // if (connection === "open" && sendWAMExample) {
            //    /// sending WAM EXAMPLE
            //    const {
            //       header: { wamVersion, eventSequenceNumber },
            //       events,
            //    } = JSON.parse(
            //       await fs.promises.readFile(
            //          "./boot_analytics_test.json",
            //          "utf-8"
            //       )
            //    );
            //    const binaryInfo = new BinaryInfo({
            //       protocolVersion: wamVersion,
            //       sequence: eventSequenceNumber,
            //       events: events,
            //    });
            //    const buffer = encodeWAM(binaryInfo);
            //    const result = await sock.sendWAMBuffer(buffer);
            //    console.log(result);
            // }
            console.log("connection update", update);
        }
        // credentials updated -- save them
        if (events["creds.update"]) {
            yield saveCreds();
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
                    yield (0, newMessage_1.newMessage)(msg);
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
                    if (((_c = msg.message) === null || _c === void 0 ? void 0 : _c.conversation) ||
                        ((_e = (_d = msg.message) === null || _d === void 0 ? void 0 : _d.extendedTextMessage) === null || _e === void 0 ? void 0 : _e.text)) {
                        const text = ((_f = msg.message) === null || _f === void 0 ? void 0 : _f.conversation) ||
                            ((_h = (_g = msg.message) === null || _g === void 0 ? void 0 : _g.extendedTextMessage) === null || _h === void 0 ? void 0 : _h.text);
                        if (text == "requestPlaceholder" && !upsert.requestId) {
                            const messageId = yield sock.requestPlaceholderResend(msg.key);
                            console.log("requested placeholder resync, id=", messageId);
                        }
                        else if (upsert.requestId) {
                            console.log("Message received from phone, id=", upsert.requestId, msg);
                        }
                        // go to an old chat and send this
                        if (text == "onDemandHistSync") {
                            const messageId = yield sock.fetchMessageHistory(50, msg.key, msg.messageTimestamp);
                            console.log("requested on-demand sync, id=", messageId);
                        }
                    }
                    if (!msg.key.fromMe &&
                        doReplies &&
                        !(0, baileys_1.isJidNewsletter)((_j = msg.key) === null || _j === void 0 ? void 0 : _j.remoteJid)) {
                        console.log("replying to", msg.key.remoteJid);
                        yield sock.readMessages([msg.key]);
                        yield sendMessageWTyping({ text: "Hello there!" }, msg.key.remoteJid);
                    }
                }
            }
        }
        // messages updated like status delivered, message deleted etc.
        if (events["messages.update"]) {
            console.log(JSON.stringify(events["messages.update"], undefined, 2));
            for (const { key, update } of events["messages.update"]) {
                if (update.pollUpdates) {
                    const pollCreation = {}; // get the poll creation message somehow
                    if (pollCreation) {
                        console.log("got poll update, aggregation: ", (0, baileys_1.getAggregateVotesInPollMessage)({
                            message: pollCreation,
                            pollUpdates: update.pollUpdates,
                        }));
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
    }));
    return sock;
    function getMessage(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implement a way to retreive messages that were upserted from messages.upsert
            // up to you
            // only if store is present
            return baileys_1.proto.Message.fromObject({});
        });
    }
});
startSock();
