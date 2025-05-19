export type ChoseWhatToDo = { label: string; value: string; }[];

export type ImageType = { data: string, width: number, height: number }

export type PrintUtilsType = { html: string; printerName: string; numberOfCopies: number };

export type PrintResult = { success: boolean; message?: string }

export type HtmlToPdfType = { html: string; copies?: number; maxWidth?: number; }

export type PrintReceiptType = { imgArgs: { data: string; width: number; height: number; html:string }; printerName: string; copies?: number; };

type OSPlatform = 'darwin' | 'win32' | 'linux' | 'aix' | 'android' | 'freebsd' | 'openbsd' | 'sunos' | string;