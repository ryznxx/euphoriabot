/**
 * Ekspor semua komponen terkait plugin
 */

// Ekspor BadWordFilter
export { BadWordFilter } from './regex';

// Ekspor fungsi-fungsi untuk membuat BadWordFilter
export {
  createBadWordFilter,
  createIndonesianBadWordFilter,
  createEnglishBadWordFilter,
  exampleUsage as badWordFilterExample
} from './badWordFilterExample';