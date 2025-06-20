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
const newMessage = (m) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    /**
     * kegunaan ini untuk mengambil prompt, setelah prefix
     */
    const prompt = (_c = (_b = (_a = m.message) === null || _a === void 0 ? void 0 : _a.extendedTextMessage) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c.toString().toLowerCase().slice(1).trim().split(" ")[0];
    /**
     * kegunaan variabel ini untuk cek apakah hasil text tersebut include prefix
     */
    const isPrompt = (_f = (_e = (_d = m.message) === null || _d === void 0 ? void 0 : _d.extendedTextMessage) === null || _e === void 0 ? void 0 : _e.text) === null || _f === void 0 ? void 0 : _f.toString().startsWith("!");
    /**
     * kegunaan variabel ini untuk mengambil argumentasi setelah prompt
     */
    const arg2 = (_j = (_h = (_g = m.message) === null || _g === void 0 ? void 0 : _g.extendedTextMessage) === null || _h === void 0 ? void 0 : _h.text) === null || _j === void 0 ? void 0 : _j.toString().split(" ").slice(1).join(" ");
    if (isPrompt) {
        // <-- ini pokok cek apakah pesan ini bagian dari prompt
        if (prompt == "test") {
            console.log(arg2);
        }
    }
    else {
        console.log(chalk_1.default.bgBlue(`[${((_k = m.key.remoteJid) === null || _k === void 0 ? void 0 : _k.split("@")[1].toString().includes("g.us"))
            ? "group"
            : "private"}]`) +
            chalk_1.default.bgCyanBright(((_l = m.key.remoteJid) === null || _l === void 0 ? void 0 : _l.split("@")[1].toString().includes("g.us"))
                ? chalk_1.default.bold(" gid ") +
                    chalk_1.default.yellow((_m = m.key.remoteJid) === null || _m === void 0 ? void 0 : _m.split("@")[0].toString()) +
                    " "
                : chalk_1.default.bold(" nwa ") +
                    ((_o = m.key.remoteJid) === null || _o === void 0 ? void 0 : _o.split("@")[0].toString()) +
                    " "), "new message :", chalk_1.default.blueBright((_q = (_p = m.message) === null || _p === void 0 ? void 0 : _p.extendedTextMessage) === null || _q === void 0 ? void 0 : _q.text));
    }
});
exports.newMessage = newMessage;
