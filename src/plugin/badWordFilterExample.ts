/**
 * Contoh penggunaan BadWordFilter dengan daftar kata kasar
 */

import { BadWordFilter } from './regex';
import { allBadWords, indonesianBadWords, englishBadWords } from '../keyword/list.badword';

/**
 * Membuat instance BadWordFilter dengan semua kata kasar
 */
export const createBadWordFilter = (): BadWordFilter => {
  return new BadWordFilter(allBadWords);
};

/**
 * Membuat instance BadWordFilter dengan kata kasar bahasa Indonesia saja
 */
export const createIndonesianBadWordFilter = (): BadWordFilter => {
  return new BadWordFilter(indonesianBadWords);
};

/**
 * Membuat instance BadWordFilter dengan kata kasar bahasa Inggris saja
 */
export const createEnglishBadWordFilter = (): BadWordFilter => {
  return new BadWordFilter(englishBadWords);
};

/**
 * Contoh penggunaan BadWordFilter
 */
const exampleUsage = (): void => {
  // Membuat filter dengan semua kata kasar
  const filter = createBadWordFilter();
  
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

// Ekspor fungsi contoh penggunaan untuk keperluan testing
export { exampleUsage };