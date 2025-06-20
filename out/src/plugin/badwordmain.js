"use strict";
/**
 * Ekspor semua komponen terkait plugin
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.badWordFilterExample = exports.createEnglishBadWordFilter = exports.createIndonesianBadWordFilter = exports.createBadWordFilter = exports.BadWordFilter = void 0;
// Ekspor BadWordFilter
var regex_1 = require("./regex");
Object.defineProperty(exports, "BadWordFilter", { enumerable: true, get: function () { return regex_1.BadWordFilter; } });
// Ekspor fungsi-fungsi untuk membuat BadWordFilter
var badWordFilterExample_1 = require("./badWordFilterExample");
Object.defineProperty(exports, "createBadWordFilter", { enumerable: true, get: function () { return badWordFilterExample_1.createBadWordFilter; } });
Object.defineProperty(exports, "createIndonesianBadWordFilter", { enumerable: true, get: function () { return badWordFilterExample_1.createIndonesianBadWordFilter; } });
Object.defineProperty(exports, "createEnglishBadWordFilter", { enumerable: true, get: function () { return badWordFilterExample_1.createEnglishBadWordFilter; } });
Object.defineProperty(exports, "badWordFilterExample", { enumerable: true, get: function () { return badWordFilterExample_1.exampleUsage; } });
