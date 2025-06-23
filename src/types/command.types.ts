/**
 * Command
 * @argument commandName this is should be the command name
 * @method execute kind function to execute
 */

export interface Command {
   commandName: string;
   execute: (args: string, jid: string, sender: string) => void | Promise<void>;
}
