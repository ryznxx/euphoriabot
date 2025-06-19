import fs from "node:fs";

interface PerKalimat {
   kata: string;
}

interface ListBadword {
   listBadword: PerKalimat[];
}

export const saveToJson = (path: string, data: ListBadword): boolean => {
   if (path === "") {
      console.log("Path Tujuan kosong");
      return false;
   }

   if (data.listBadword.length > 0 && path !== "") {
      try {
         const toJson = JSON.stringify(data, null, 2);
         fs.writeFileSync(path, toJson);
         console.log("Berhasil menyimpan data json");
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   console.log("Parameter yang dimasukkan tidak valid");
   return false;
};
