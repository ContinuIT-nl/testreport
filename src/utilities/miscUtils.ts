import { readFile, writeFile } from 'node:fs/promises';

const invalidPercentage = 'N/A';

export const percentageNoZero = (value: number, total: number) => {
  if (!total) return invalidPercentage;
  return value ? `${(value * 100 / total).toFixed(1)}%` : '';
};

export const percentage = (value: number, total: number) => {
  if (!total) return invalidPercentage;
  return `${(value * 100 / total).toFixed(1)}%`;
};

export class TextFileError extends Error {}
export class WriteTextFileError extends TextFileError {}
export class ReadTextFileError extends TextFileError {}

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
  } catch (error) { // Create a nice exception text
    throw new ReadTextFileError(`Error reading file ${filename}: ${(error as Error).message}`);
  }
}
