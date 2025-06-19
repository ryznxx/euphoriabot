/**
 * Daftar kata-kata kasar (bad words) untuk difilter
 */

// Daftar kata kasar dalam bahasa Indonesia
const indonesianBadWords: string[] = [
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

// Daftar kata kasar dalam bahasa Inggris
const englishBadWords: string[] = [
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

// Gabungan semua daftar kata kasar
export const allBadWords: string[] = [
  ...indonesianBadWords,
  ...englishBadWords
];

// Ekspor daftar terpisah jika diperlukan
export {
  indonesianBadWords,
  englishBadWords
};