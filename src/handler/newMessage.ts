import { proto } from "baileys";
import chalk from "chalk";

/**
 * setiap kali pesan masuk maka fungsi ini akan dieksekusi
 * untuk menyimpan dan melakukan aksi
 * @description sebuah arrow fungsi untuk handling pesan baru
 * @summary future
 * @param m message interface
 */
export const newMessage = async (m: proto.IWebMessageInfo) => {
   /**
    * kegunaan ini untuk mengambil prompt, setelah prefix
    */
   const prompt: string | unknown | undefined =
      m.message?.extendedTextMessage?.text
         ?.toString()
         .toLowerCase()
         .slice(1)
         .trim()
         .split(" ")[0];

   /**
    * kegunaan variabel ini untuk cek apakah hasil text tersebut include prefix
    */
   const isPrompt: boolean | unknown | undefined =
      m.message?.extendedTextMessage?.text?.toString().startsWith("!");

   /**
    * kegunaan variabel ini untuk mengambil argumentasi setelah prompt
    */
   const arg2: string | unknown | undefined =
      m.message?.extendedTextMessage?.text
         ?.toString()
         .split(" ")
         .slice(1)
         .join(" ");

   if (isPrompt) {
      // <-- ini pokok cek apakah pesan ini bagian dari prompt
      if (prompt == "test") {
         console.log(arg2);
      }
   }

   if (!isPrompt) {
      console.log(
         chalk.bgBlue(
            `[${
               m.key.remoteJid?.split("@")[1].toString().includes("g.us")
                  ? "group"
                  : "private"
            }]`
         ) +
            chalk.bgCyanBright(
               m.key.remoteJid?.split("@")[1].toString().includes("g.us")
                  ? chalk.bold(" gid ") +
                       chalk.yellow(m.key.remoteJid?.split("@")[0].toString()) +
                       " "
                  : chalk.bold(" nwa ") +
                       m.key.remoteJid?.split("@")[0].toString() +
                       " "
            ),
         "message :",
         chalk.blueBright(m.message?.extendedTextMessage?.text)
      );
   }
};
