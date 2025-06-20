export interface Command {
   commandName: string;
   execute: (args: string) => void | Promise<void>;
}
