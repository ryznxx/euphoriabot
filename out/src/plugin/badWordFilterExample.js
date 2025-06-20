"use strict";
/**
 * Contoh penggunaan BadWordFilter dengan daftar kata kasar
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleUsage = exports.createEnglishBadWordFilter = exports.createIndonesianBadWordFilter = exports.createBadWordFilter = void 0;
const regex_1 = require("./regex");
const list_badword_1 = require("../keyword/list.badword");
/**
 * Membuat instance BadWordFilter dengan semua kata kasar
 */
const createBadWordFilter = () => {
    return new regex_1.BadWordFilter(list_badword_1.allBadWords);
};
exports.createBadWordFilter = createBadWordFilter;
/**
 * Membuat instance BadWordFilter dengan kata kasar bahasa Indonesia saja
 */
const createIndonesianBadWordFilter = () => {
    return new regex_1.BadWordFilter(list_badword_1.indonesianBadWords);
};
exports.createIndonesianBadWordFilter = createIndonesianBadWordFilter;
/**
 * Membuat instance BadWordFilter dengan kata kasar bahasa Inggris saja
 */
const createEnglishBadWordFilter = () => {
    return new regex_1.BadWordFilter(list_badword_1.englishBadWords);
};
exports.createEnglishBadWordFilter = createEnglishBadWordFilter;
/**
 * Contoh penggunaan BadWordFilter
 */
const exampleUsage = () => {
    // Membuat filter dengan semua kata kasar
    const filter = (0, exports.createBadWordFilter)();
    // Contoh teks untuk difilter
    const text1 = 'Ini adalah contoh kalimat normal.';
    const text2 = 'Ini adalah contoh kalimat dengan kata anjing di dalamnya.';
    // Memeriksa apakah teks mengandung kata kasar
    console.log(`Teks 1 bersih: ${filter.filterText(text1)}`);
    console.log(`Teks 2 bersih: ${filter.filterText(text2)}`);
    // Menyensor kata kasar dalam teks
    console.log(`Teks 2 disensor: ${filter.censorText(text2)}`);
    // Menambahkan kata kasar baru
    filter.addBadWord('kata_baru');
    // Mendapatkan daftar kata kasar
    console.log(`Jumlah kata kasar: ${filter.getBadWords().length}`);
};
exports.exampleUsage = exampleUsage;
