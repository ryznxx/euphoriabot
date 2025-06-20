"use strict";
/**
 * Daftar kata-kata kasar (bad words) untuk difilter
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.englishBadWords = exports.indonesianBadWords = exports.allBadWords = void 0;
// Daftar kata kasar dalam bahasa Indonesia
const indonesianBadWords = [
    'anjing',
    'bangsat',
    'brengsek',
    'kampret',
    'kontol',
    'memek',
    'ngentot',
    'perek',
    'tolol'
    // Tambahkan kata-kata lain sesuai kebutuhan
];
exports.indonesianBadWords = indonesianBadWords;
// Daftar kata kasar dalam bahasa Inggris
const englishBadWords = [
    'asshole',
    'bastard',
    'bitch',
    'cunt',
    'dick',
    'fuck',
    'pussy',
    'shit',
    'slut'
    // Tambahkan kata-kata lain sesuai kebutuhan
];
exports.englishBadWords = englishBadWords;
// Gabungan semua daftar kata kasar
exports.allBadWords = [
    ...indonesianBadWords,
    ...englishBadWords
];
