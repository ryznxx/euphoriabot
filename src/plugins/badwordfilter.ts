import fs from "node:fs";
import { saveToJson } from "./helper";

export class BadWordFilter {
   private badWords: string[] = [];
   private regexList: RegExp[] = [];

   /**
    * Regenerasi regexList dari badWords (dipanggil internal)
    */
   private syncRegex(): void {
      this.regexList = this.badWords.map((word) => new RegExp(word, "i"));
   }

   public loadBadword(): void {
      const data: string = fs
         .readFileSync("./src/keywords/list_badword.json")
         .toString();
      const parsedData = JSON.parse(data);
      console.log(parsedData.listBadword);
      this.badWords = parsedData.listBadword;
   }
   
   public addBadWord(word: string): void {
      if (!this.badWords.includes(word)) {
         this.badWords.push(word);
         this.syncRegex();
      }
   }

   public addBadWords(words: string[]): void {
      words.forEach((word) => {
         if (!this.badWords.includes(word)) this.badWords.push(word);
      });
      this.syncRegex();
   }

   public removeBadWord(word: string): void {
      this.badWords = this.badWords.filter((badWord) => badWord !== word);
      this.syncRegex();
   }

   public getBadWords(): string[] {
      return [...this.badWords];
   }

   public saveToKeywordFilter(): boolean {
      const formatted = {
         listBadword: this.badWords.map((kata) => ({ kata })),
      };
      return saveToJson("./src/keywords/list_badword.json", formatted);
   }

   public checkThisTextBadWord(text: string): boolean {
      const lower = text.toLowerCase();
      return this.regexList.some((pattern) => pattern.test(lower));
   }
}
