import { Command } from "./types.command";

export const isBotActive: Command = {
   commandName: "aktif",
   execute: (args: string) => {
      console.log("Bot sedang aktif dengan argumen:", args);
   },
};

export default isBotActive;
