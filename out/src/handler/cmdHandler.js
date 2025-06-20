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
// handlers/cmdHandler.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commands = {};
/**
 * Rekursif baca file dari folder commands
 */
const loadCommands = (dir) => {
    const files = fs_1.default.readdirSync(dir);
    for (const file of files) {
        const filePath = path_1.default.join(dir, file);
        const stat = fs_1.default.statSync(filePath);
        if (stat.isDirectory()) {
            loadCommands(filePath);
        }
        else if (file.endsWith(".ts") || file.endsWith(".js")) {
            const imported = require(filePath);
            const cmd = imported.default;
            if ((cmd === null || cmd === void 0 ? void 0 : cmd.commandName) && typeof cmd.execute === "function") {
                commands[cmd.commandName] = cmd;
            }
        }
    }
};
const commandsDir = path_1.default.join(__dirname, "../commands");
loadCommands(commandsDir);
/**
 * Menjalankan command berdasarkan prompt
 */
const cmdHandler = (prompt, args) => __awaiter(void 0, void 0, void 0, function* () {
    const cmd = commands[prompt];
    if (!cmd) {
        console.log(`Perintah "${prompt}" tidak ditemukan`);
        return;
    }
    yield cmd.execute(args);
});
exports.default = cmdHandler;
