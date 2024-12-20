import { writeFile } from './dependencies.ts';

export const percentage = (value: number, total: number) => value ? `${((value / total) * 100).toFixed(1)}%` : '';

// todo: use @std:path
export const extractFilename = (filename: string) => filename.replace(/\\/g, '/').split('/').at(-1)!;

export async function exportOutput(filename: string | undefined, createData: () => string) {
  if (!filename) return;
  const utf8Encoder = new TextEncoder();
  const dataBytes = utf8Encoder.encode(createData());
  await writeFile(filename, dataBytes);
}
