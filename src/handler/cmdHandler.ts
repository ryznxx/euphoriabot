// handlers/cmdHandler.ts
import fs from "fs";
import path from "path";
import { Command } from "../commands/types.command";

const commands: Record<string, Command> = {};

/**
 * Rekursif baca file dari folder commands
 */
const loadCommands = (dir: string) => {
   const files = fs.readdirSync(dir);

   for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
         loadCommands(filePath);
      } else if (file.endsWith(".ts") || file.endsWith(".js")) {
         const imported = require(filePath);
         const cmd = imported.default;

         if (cmd?.commandName && typeof cmd.execute === "function") {
            commands[cmd.commandName] = cmd;
         }
      }
   }
};

const commandsDir = path.join(__dirname, "../commands");
loadCommands(commandsDir);

/**
 * Menjalankan command berdasarkan prompt
 */
const cmdHandler = async (prompt: string, args: string): Promise<void> => {
   const cmd = commands[prompt];

   if (!cmd) {
      console.log(`Perintah "${prompt}" tidak ditemukan`);
      return;
   }

   await cmd.execute(args);
};

export default cmdHandler;
