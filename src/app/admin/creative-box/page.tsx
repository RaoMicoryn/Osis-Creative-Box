import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminCreativeBox from '@/components/admin/AdminCreativeBox';
import { SESSION_COOKIE, verifySessionToken } from '@/server/http/session';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin Creative Box | Kotak Aspirasi OSIS', robots: { index: false, follow: false } };

export default function AdminCreativeBoxPage() {
  // Dicek di server SEBELUM HTML apa pun dikirim: tanpa sesi valid => langsung ke login
  if (!verifySessionToken(cookies().get(SESSION_COOKIE)?.value)) redirect('/admin/login');
  return <AdminCreativeBox />;
}
