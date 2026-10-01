import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminLogin from '@/components/admin/AdminLogin';
import { SESSION_COOKIE, verifySessionToken } from '@/server/http/session';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Login Admin | Creative Box', robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  if (verifySessionToken(cookies().get(SESSION_COOKIE)?.value)) redirect('/admin/creative-box');
  return <AdminLogin />;
}
