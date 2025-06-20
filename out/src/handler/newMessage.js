"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newMessage = void 0;
const chalk_1 = __importDefault(require("chalk"));
const cmdHandler_1 = __importDefault(require("./cmdHandler"));
/**
 * Fungsi ini akan dijalankan setiap kali ada pesan masuk dari WhatsApp.
 *
 * Tujuan utamanya untuk:
 * - Mengecek apakah pesan mengandung command (diawali prefix "!")
 * - Menjalankan handler jika pesan adalah command
 * - Menampilkan pesan biasa (log) jika bukan command
 *
 * @param m - Objek pesan dari Baileys
 */
const newMessage = (m) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    /**
     * Raw text dari pesan, jika ada.
     * Bisa undefined/null kalau message kosong atau bukan text.
     */
    const rawText = (_c = (_b = (_a = m.message) === null || _a === void 0 ? void 0 : _a.extendedTextMessage) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c.toString();
    if (!rawText)
        return;
    /**
     * Menandakan apakah pesan dimulai dengan prefix "!"
     * Ini artinya kemungkinan besar adalah command
     */
    const isPrompt = rawText.startsWith("!");
    /**
     * Pecah isi pesan jadi array kata:
     * - slice(1): buang prefix "!"
     * - toLowerCase(): biar konsisten case-nya
     */
    const words = rawText.trim().slice(1).toLowerCase().split(" ");
    /**
     * Nama perintah yang diketik user, misal: "test", "ping"
     */
    const prompt = words[0];
    /**
     * Argumen tambahan setelah command, digabung sebagai string
     */
    const arg2 = words.slice(1).join(" ");
    /**
     * Jika pesan adalah command, lempar ke command handler
     */
    if (isPrompt) {
        yield (0, cmdHandler_1.default)(prompt, arg2);
    }
    /**
     * Jika bukan command, tampilkan isi pesan ke konsol (log monitoring)
     */
    if (!isPrompt) {
        const isGroup = (_d = m.key.remoteJid) === null || _d === void 0 ? void 0 : _d.includes("g.us");
        const jid = ((_e = m.key.remoteJid) === null || _e === void 0 ? void 0 : _e.split("@")[0]) || "-";
        const prefix = isGroup
            ? chalk_1.default.bgBlue("[group]") +
                chalk_1.default.bgCyanBright.bold(" gid ") +
                " " +
                chalk_1.default.yellow(jid)
            : chalk_1.default.bgBlue("[private]") +
                chalk_1.default.bgCyanBright.bold(" nwa ") +
                " " +
                chalk_1.default.yellow(jid);
        console.log(prefix, "message :", chalk_1.default.blueBright(rawText));
    }
});
exports.newMessage = newMessage;
