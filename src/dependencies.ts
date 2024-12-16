import { readFile as rf, writeFile as wf } from 'node:fs/promises';
import * as process from 'node:process';

type ReadFile = (path: string) => Promise<Uint8Array>;
type WriteFile = (path: string, data: Uint8Array) => Promise<void>;
type GetArguments = () => string[];
type Exit = (code: number) => void;

export const readFile: ReadFile = rf;
export const writeFile: WriteFile = wf;
export const getArguments: GetArguments = () => process.argv.slice(2);
export const exit: Exit = (code: number) => process.exit(code);


