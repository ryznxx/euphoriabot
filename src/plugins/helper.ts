import fs from "node:fs";
import error from "../keywords/error.message";

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
    console.log(error.emptyPath);
    return false;
  }

  if (!Array.isArray(data.listBadword)) {
    console.log(error.invalidDataFormat);
    return false;
  }

  try {
    const toJson = JSON.stringify(data, null, 2);
    fs.writeFileSync(path, toJson);
    console.log(error.saveSuccess + ":", path);
    return true;
  } catch (err) {
    console.log(error.saveFailed + ":", err);
    return false;
  }
};
