import { sendMessage, sendMessageWTyping } from "./reply.handler";
import fs from "fs";
import { filter } from "../core/badword.instance";
import path from "path";
import { Command } from "../types/command.types";
import chalk from "chalk";
import error from "../keywords/error.message";

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
const cmdHandler = async (
   rawText: string,
   prompt: string,
   args: string,
   jid: string,
   sender: string | null | undefined
): Promise<void> => {
   if (!sender) return;

   const cmd = commands[prompt];

   if (
      filter.checkThisTextBadWord(rawText) &&
      prompt.toLocaleLowerCase() !== "tambahbadword" &&
      args !== ""
   ) {
      sendMessageWTyping({ text: error.badword }, sender as string);
      return;
   }

   if (!cmd) {
      console.log(
         chalk.italic.bgBlueBright.bold("unknown command"),
         chalk.reset.red(`${prompt} never executed`),
         "from",
         jid
      );
      sendMessageWTyping({ text: error.unknownCommand }, sender as string);
      return;
   }

   console.log(
      chalk.italic.bgBlueBright.bold("executed command"),
      chalk.reset.yellow(cmd.commandName),
      "from",
      jid
   );

   await cmd.execute(args, jid, sender);
};

export default cmdHandler;
