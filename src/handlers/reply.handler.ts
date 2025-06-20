import { AnyMessageContent, WASocket, delay } from "baileys";

let sock: WASocket; // GLOBAL DALAM MODULE

/**
 * Inisialisasi sock dari luar, cukup dipanggil sekali
 */
export const initReply = (socket: WASocket) => {
   sock = socket;
};

/**
 * Kirim pesan dengan simulasi ngetik
 */
export const sendMessageWTyping = async (
   msg: AnyMessageContent,
   jid: string
) => {
   if (!sock)
      throw new Error("Sock belum di-init, panggil initReply(sock) dulu!");

   await sock.presenceSubscribe(jid);
   await delay(500);

   await sock.sendPresenceUpdate("composing", jid);
   await delay(2000);

   await sock.sendPresenceUpdate("paused", jid);

   await sock.sendMessage(jid, msg);
};
export const sendMessage = async (msg: AnyMessageContent, jid: string) => {
   if (!sock)
      throw new Error("Sock belum di-init, panggil initReply(sock) dulu!");

   await sock.sendMessage(jid, msg);
};
