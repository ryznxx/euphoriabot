import { proto } from "baileys";
import chalk from "chalk";
export const newMessage = async (m: proto.IWebMessageInfo) => {
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
      "new message :",
      chalk.blueBright(m.message?.extendedTextMessage?.text)
      // JSON.stringify(m.message, null, 2)
   );
};
