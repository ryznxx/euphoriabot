import { Command } from "../types/types.command";
import { filter } from "../core/badword.instance"; // misal ini instancenya

export const tambahBadword: Command = {
   commandName: "tambahBadword",
   execute: (args: string) => {
      if (!args.trim()) {
         console.log(
            "❌ Argumen kosong, masukkan kata kasar yang mau ditambahin"
         );
         return;
      }

      const kataKasar = args
         .split(",") // bisa juga pake spasi atau split yang lain
         .map((w) => w.trim())
         .filter((w) => !!w);

      if (kataKasar.length === 0) {
         console.log("❌ Tidak ada kata valid untuk ditambahkan");
         return;
      }

      filter.addBadWords(kataKasar);
      const status = filter.saveToKeywordFilter();

      if (status) {
         console.log("✅ Kata kasar ditambahkan:", kataKasar.join(", "));
      } else {
         console.log("❌ Gagal menyimpan ke file JSON");
      }
   },
};

export default tambahBadword;
