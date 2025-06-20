"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToJson = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const saveToJson = (path, data) => {
    if (path === "") {
        console.log("Path Tujuan kosong");
        return false;
    }
    if (data.listBadword.length > 0 && path !== "") {
        try {
            const toJson = JSON.stringify(data, null, 2);
            node_fs_1.default.writeFileSync(path, toJson);
            console.log("Berhasil menyimpan data json");
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    console.log("Parameter yang dimasukkan tidak valid");
    return false;
};
exports.saveToJson = saveToJson;
