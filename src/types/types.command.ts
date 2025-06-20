export interface Command {
   commandName: string;
   execute: (args: string, jid: string, sender: string) => void | Promise<void>;
}
