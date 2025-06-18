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
    var _a, _b, _c, _d, _e, _f;
    console.log(chalk_1.default.bgBlue(`[${((_a = m.key.remoteJid) === null || _a === void 0 ? void 0 : _a.split("@")[1].toString().includes("g.us"))
        ? "group"
        : "private"}]`) +
        chalk_1.default.bgCyanBright(((_b = m.key.remoteJid) === null || _b === void 0 ? void 0 : _b.split("@")[1].toString().includes("g.us"))
            ? chalk_1.default.bold(" gid ") +
                chalk_1.default.yellow((_c = m.key.remoteJid) === null || _c === void 0 ? void 0 : _c.split("@")[0].toString()) +
                " "
            : chalk_1.default.bold(" nwa ") +
                ((_d = m.key.remoteJid) === null || _d === void 0 ? void 0 : _d.split("@")[0].toString()) +
                " "), "new message :", chalk_1.default.blueBright((_f = (_e = m.message) === null || _e === void 0 ? void 0 : _e.extendedTextMessage) === null || _f === void 0 ? void 0 : _f.text)
    // JSON.stringify(m.message, null, 2)
    );
});
exports.newMessage = newMessage;
