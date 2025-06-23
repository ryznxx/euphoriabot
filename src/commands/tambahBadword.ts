import { sendMessage } from "../handlers/reply.handler";
import { Command } from "../types/types.command";
import { filter } from "../core/badword.instance"; // misal ini instancenya
import error from "../keywords/error.message";

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
               text: `${coded(args.split(",").toString())} ${
                  error.badwordExists
               }`,
            },
            sender
         );
         return;
      }

      const status: boolean = filter.saveToKeywordFilter();

      if (status) {
         await sendMessage(
            {
               text: `${coded(args.split(",").toString())} ${
                  error.badwordAddSuccess
               }`,
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
