import { sendMessage } from "../handlers/reply.handler";
import { Command } from "../types/command.types";
import { filter } from "../core/badword.instance"; // misal ini instancenya
import error from "../keywords/error.message";
import success from "../keywords/success.message";

function coded(word: string): string {
   return "```" + word + "```";
}

export const tambahBadword: Command = {
   commandName: "tambahbadword",
   execute: async (args: string, jid: string, sender: string) => {
      if (!args.trim()) {
         await sendMessage(
            {
               text: error.invalidArgument,
            },
            sender
         );
         return;
      }

      const kataKasar = args
         .split(",")
         .map((w) => w.trim())
         .filter((w) => !!w);

      if (kataKasar.length === 0) {
         await sendMessage(
            {
               text: error.invalidArgument,
            },
            sender
         );
         return;
      }

      const badwordWasAdded: boolean = filter.addBadWords(kataKasar);
      if (!badwordWasAdded) {
         await sendMessage(
            {
               text: `${error.badwordExists}`,
            },
            sender
         );
         return;
      }

      const status: boolean = filter.saveToKeywordFilter();

      if (status) {
         await sendMessage(
            {
               text: `${success.addedBadword}: ${coded(
                  args.split(",").toString()
               )}`,
            },
            sender
         );
      } else {
         await sendMessage(
            {
               text: `${coded(args.split(",").toString())} ${
                  error.badwordAddFailed
               }`,
            },
            sender
         );
      }
   },
};

export default tambahBadword;
