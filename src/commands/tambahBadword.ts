import { sendMessage } from "./../handlers/reply.handler";
import { Command } from "../types/types.command";
import { filter } from "../core/badword.instance"; // misal ini instancenya

export const tambahBadword: Command = {
   commandName: "tambahbadword",
   execute: async (args: string, jid: string, sender: string) => {
      if (!args.trim()) {
         console.log(
            "❌ Argumen kosong, masukkan kata kasar yang mau ditambahin"
         );
         return;
      }

      const kataKasar = args
         .split(",")
         .map((w) => w.trim())
         .filter((w) => !!w);

      if (kataKasar.length === 0) {
         console.log("❌ Tidak ada kata valid untuk ditambahkan");
         return;
      }

      filter.addBadWords(kataKasar);
      const status = filter.saveToKeywordFilter();

      if (status) {
         await sendMessage(
            {
               text: `${args.split(
                  ","
               )} sudah ditambahkan kedalam database badword`,
            },
            sender
         );
         console.log("✅ Kata kasar ditambahkan:", kataKasar.join(", "));
      } else {
         console.log("❌ Gagal menyimpan ke file JSON");
      }
   },
};

export default tambahBadword;
