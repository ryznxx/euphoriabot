/**
 * Class untuk memfilter kata-kata kasar (bad words) menggunakan regex
 */
export class BadWordFilter {
  private badWords: string[];

  /**
   * Constructor untuk inisialisasi daftar kata kasar
   * @param badWords Array berisi daftar kata-kata kasar yang akan difilter
   */
  constructor(badWords: string[] = []) {
    this.badWords = badWords;
  }

  /**
   * Menambahkan kata kasar baru ke dalam daftar
   * @param word Kata kasar yang akan ditambahkan
   */
  public addBadWord(word: string): void {
    if (!this.badWords.includes(word)) {
      this.badWords.push(word);
    }
  }

  /**
   * Menambahkan beberapa kata kasar sekaligus ke dalam daftar
   * @param words Array berisi kata-kata kasar yang akan ditambahkan
   */
  public addBadWords(words: string[]): void {
    words.forEach(word => this.addBadWord(word));
  }

  /**
   * Menghapus kata kasar dari daftar
   * @param word Kata kasar yang akan dihapus
   */
  public removeBadWord(word: string): void {
    this.badWords = this.badWords.filter(badWord => badWord !== word);
  }

  /**
   * Mendapatkan daftar kata kasar yang tersimpan
   * @returns Array berisi daftar kata kasar
   */
  public getBadWords(): string[] {
    return [...this.badWords];
  }

  /**
   * Memeriksa apakah teks mengandung kata kasar
   * @param text Teks yang akan diperiksa
   * @returns false jika teks mengandung kata kasar, true jika tidak
   */
  public filterText(text: string): boolean {
    if (!text || this.badWords.length === 0) {
      return true;
    }

    // Membuat pola regex dari daftar kata kasar
    // Menggunakan word boundary (\b) untuk memastikan pencocokan kata utuh
    const pattern = new RegExp(`\\b(${this.badWords.join('|')})\\b`, 'i');
    
    // Mengembalikan false jika kata kasar terdeteksi, true jika tidak
    return !pattern.test(text);
  }

  /**
   * Menyensor kata-kata kasar dalam teks dengan karakter tertentu
   * @param text Teks yang akan disensor
   * @param censorChar Karakter untuk menyensor (default: '*')
   * @returns Teks yang sudah disensor
   */
  public censorText(text: string, censorChar: string = '*'): string {
    if (!text || this.badWords.length === 0) {
      return text;
    }

    let censoredText = text;
    
    // Membuat pola regex untuk setiap kata kasar
    this.badWords.forEach(word => {
      const pattern = new RegExp(`\\b${word}\\b`, 'gi');
      censoredText = censoredText.replace(pattern, censorChar.repeat(word.length));
    });

    return censoredText;
  }
}