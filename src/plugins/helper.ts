import fs from "node:fs";

interface PerKalimat {
   kata: string;
}

interface ListBadword {
   listBadword: PerKalimat[];
}

/**
 * Menyimpan data ke file JSON secara sinkron
 * @param path - path tujuan file JSON
 * @param data - data yang ingin disimpan
 * @returns boolean - true jika berhasil, false jika gagal
 */
export const saveToJson = (path: string, data: ListBadword): boolean => {
   if (!path.trim()) {
      console.log("path tujuan kosong");
      return false;
   }

   if (!Array.isArray(data.listBadword)) {
      console.log("format data tidak valid");
      return false;
   }

   try {
      const toJson = JSON.stringify(data, null, 2);
      fs.writeFileSync(path, toJson);
      console.log("data berhasil disimpan ke JSON:", path);
      return true;
   } catch (error) {
      console.log("gagal menyimpan data:", error);
      return false;
   }
};
