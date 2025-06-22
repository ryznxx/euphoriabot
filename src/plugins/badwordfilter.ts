import fs from "node:fs";
import { saveToJson } from "./helper";

export class BadWordFilter {
   private badWords: string[] = [];
   private regexList: RegExp[] = [];

   private syncRegex(): void {
      this.regexList = this.badWords.map((word) => new RegExp(word, "i"));
   }

   public loadBadword(): void {
      const data = fs.readFileSync("./src/keywords/list_badword.json", "utf-8");
      const parsed = JSON.parse(data);

      if (Array.isArray(parsed.listBadword)) {
         this.badWords = parsed.listBadword.map((x: any) =>
            typeof x === "string" ? x : x.kata
         );
         this.syncRegex();
      } else {
         throw new Error("Format JSON badword salah");
      }
   }

   public addBadWord(word: string): void {
      const cleaned = word.trim().toLowerCase();
      if (!this.badWords.includes(cleaned)) {
         this.badWords.push(cleaned);
         this.syncRegex();
      }
   }

   public addBadWords(words: string[]): boolean {
      let added = false;

      words.forEach((word) => {
         const cleaned = word.trim().toLowerCase();
         if (!this.badWords.includes(cleaned)) {
            this.badWords.push(cleaned);
            added = true;
         }
      });

      if (added) this.syncRegex();
      return added;
   }

   public removeBadWord(word: string): void {
      const cleaned = word.trim().toLowerCase();
      this.badWords = this.badWords.filter((badWord) => badWord !== cleaned);
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
