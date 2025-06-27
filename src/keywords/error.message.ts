interface ErrorMess {
   badword: string;
   unknownCommand: string;
   commandNotExecuted: string;
   emptyPath: string;
   invalidDataFormat: string;
   saveSuccess: string;
   saveFailed: string;
   invalidBadwordFormat: string;
   invalidArgument: string;
   badwordExists: string;
   badwordAddSuccess: string;
   badwordAddFailed: string;
}

const error: ErrorMess = {
   badword: "kalimat mengandung kata kasar dan tidak sopan",
   unknownCommand: "Perintah tidak dikenal.",
   commandNotExecuted: "Operasi perintah tidak dijalankan.",
   emptyPath: "path tujuan kosong",
   invalidDataFormat: "format data tidak valid",
   saveSuccess: "data berhasil disimpan ke JSON",
   saveFailed: "gagal menyimpan data",
   invalidBadwordFormat: "Format JSON badword salah",
   invalidArgument: "Argumentasi salah! tambahkan badwordnya!",
   badwordExists: "badword sudah ditambahkan",
   badwordAddSuccess:
      "kata tersebut sudah ditambahkan kedalam database badword",
   badwordAddFailed: "kata tersebut gagal ditambahkan",
};

export default error;
