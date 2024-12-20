import { readFile, writeFile } from 'node:fs/promises';

export const percentage = (value: number, total: number) => value ? `${((value / total) * 100).toFixed(1)}%` : '';

// todo: use @std:path
export const extractFilename = (filename: string) => filename.replace(/\\/g, '/').split('/').at(-1)!;

class WriteTextFileError extends Error {}
class ReadTextFileError extends Error {}

export async function exportOutput(filename: string | undefined, createData: () => string) {
  if (!filename) return;
  try {
    const utf8Encoder = new TextEncoder();
    const dataBytes = utf8Encoder.encode(createData());
    await writeFile(filename, dataBytes);
  } catch (error) {
    throw new WriteTextFileError(`Error writing file ${filename}: ${(error as Error).message}`);
  }
}

export async function readTextFile(filename: string): Promise<string> {
  try {
    const fileBytes = await readFile(filename);
    return new TextDecoder().decode(fileBytes);
  } catch (error) {
    throw new ReadTextFileError(`Error reading file ${filename}: ${(error as Error).message}`);
  }
}
