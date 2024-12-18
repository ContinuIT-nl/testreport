export const percentage = (value: number, total: number) => value ? `${((value / total) * 100).toFixed(1)}%` : '';

export const extractFilename = (filename: string) => filename.replace(/\\/g, '/').split('/').at(-1)!;
