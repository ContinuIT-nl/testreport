import { readFile as rf, writeFile as wf } from 'node:fs/promises';

type ReadFile = (path: string) => Promise<Uint8Array>;
type WriteFile = (path: string, data: Uint8Array) => Promise<void>;

export const readFile: ReadFile = rf;
export const writeFile: WriteFile = wf;
