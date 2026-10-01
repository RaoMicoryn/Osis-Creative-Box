import { NextResponse } from 'next/server';

export interface FieldError {
  field: string;
  message: string;
}

/** Bentuk response baku untuk SEMUA endpoint. Front-end membaca `message` saat gagal. */
export interface ApiBody<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: FieldError[] | null;
}

export function ok<T>(statusCode: number, message: string, data: T, headers?: HeadersInit) {
  const body: ApiBody<T> = { success: true, statusCode, message, data, errors: null };
  return NextResponse.json(body, { status: statusCode, headers });
}

export function fail(
  statusCode: number,
  message: string,
  errors: FieldError[] | null = null,
  headers?: HeadersInit,
) {
  const body: ApiBody<null> = { success: false, statusCode, message, data: null, errors };
  return NextResponse.json(body, { status: statusCode, headers });
}

/** Error yang AMAN ditampilkan ke klien (pesannya sengaja ditulis untuk user). */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errors: FieldError[] | null = null,
    public readonly headers?: Record<string, string>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const badRequest = (message: string, errors: FieldError[] | null = null) =>
  new AppError(400, message, errors);

/**
 * Pusat penanganan error. Error tak terduga (termasuk error DB) TIDAK membocorkan
 * detail/stack ke klien; stack hanya ditulis ke log server.
 */
export function handleError(err: unknown, context: string) {
  if (err instanceof AppError) {
    return fail(err.statusCode, err.message, err.errors, err.headers);
  }
  console.error(`[${context}] unexpected error:`, err);
  return fail(500, 'Terjadi kesalahan pada server. Silakan coba lagi beberapa saat lagi.');
}
