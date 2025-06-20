import { proto } from "baileys";
import chalk from "chalk";
import cmdHandler from "./cmdHandler";

/**
 * Fungsi ini akan dijalankan setiap kali ada pesan masuk dari WhatsApp.
 *
 * Tujuan utamanya untuk:
 * - Mengecek apakah pesan mengandung command (diawali prefix "!")
 * - Menjalankan handler jika pesan adalah command
 * - Menampilkan pesan biasa (log) jika bukan command
 *
 * @param m - Objek pesan dari Baileys
 */
export const newMessage = async (m: proto.IWebMessageInfo): Promise<void> => {
   /**
    * Raw text dari pesan, jika ada.
    * Bisa undefined/null kalau message kosong atau bukan text.
    */
   const rawText: string | undefined | null =
      m.message?.extendedTextMessage?.text?.toString();

   if (!rawText) return;

   /**
    * Menandakan apakah pesan dimulai dengan prefix "!"
    * Ini artinya kemungkinan besar adalah command
    */
   const isPrompt: boolean = rawText.startsWith("!");

   /**
    * Pecah isi pesan jadi array kata:
    * - slice(1): buang prefix "!"
    * - toLowerCase(): biar konsisten case-nya
    */
   const words: string[] = rawText.trim().slice(1).toLowerCase().split(" ");

   /**
    * Nama perintah yang diketik user, misal: "test", "ping"
    */
   const prompt: string = words[0];

   /**
    * Argumen tambahan setelah command, digabung sebagai string
    */
   const arg2: string = words.slice(1).join(" ");

   /**
    * Cek apakah pesan dari grup
    */
   const isGroup: boolean | undefined = m.key.remoteJid?.includes("g.us");

   /**
    * Mendapatkan nomer dari private chat, maupun grop chat
    */
   const jid: string = m.key.remoteJid?.split("@")[0] || "-";

   /**
    * Jika pesan adalah command, lempar ke command handler
    */
   if (isPrompt) {
      await cmdHandler(prompt, arg2, jid);
   }

   /**
    * Jika bukan command, tampilkan isi pesan ke konsol (log monitoring)
    */
   if (!isPrompt) {
      const prefix = isGroup
         ? chalk.bgBlue("[group]") +
           chalk.bgCyanBright.bold(" gid ") +
           " " +
           chalk.yellow(jid)
         : chalk.bgBlue("[private]") +
           chalk.bgCyanBright.bold(" nwa ") +
           " " +
           chalk.yellow(jid);

      console.log(prefix, "message :", chalk.blueBright(rawText));
   }
};
