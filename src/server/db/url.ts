/**
 * Connection string bawaan Neon berisi `channel_binding=require`. Driver `postgres` (postgres.js)
 * tidak mengenal opsi itu: parameternya malah dikirim ke server dan ditolak
 * (`unrecognized configuration parameter "channel_binding"`). Jadi kita buang di sini,
 * sehingga string dari dashboard Neon bisa ditempel apa adanya. SSL tetap aktif lewat `sslmode`.
 */
export function cleanDatabaseUrl(raw: string): string {
  const url = new URL(raw);
  url.searchParams.delete('channel_binding');
  return url.toString();
}