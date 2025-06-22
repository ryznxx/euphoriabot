import { sendMessage, sendMessageWTyping } from "./../handlers/reply.handler";
import { Command } from "../types/types.command";

export const isBotActive: Command = {
   commandName: "aktif",
   execute: async (args: string, jid: string, sender: string) => {
      await sendMessageWTyping({ text: "Bot sudah aktif" }, sender);
   },
};

export default isBotActive;
