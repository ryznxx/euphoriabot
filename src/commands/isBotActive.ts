import { Command } from "../types/types.command";

export const isBotActive: Command = {
   commandName: "aktif",
   execute: (args: string) => {
      console.log("jawa");
   },
};

export default isBotActive;
