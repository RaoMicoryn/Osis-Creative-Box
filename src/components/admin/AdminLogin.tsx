'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { App, Button, ConfigProvider, Form, Input } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { body } from '@/components/creative-box/fonts';
import { adminTheme } from './theme';

function LoginInner() {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ password }: { password: string }) => {
    setLoading(true);
    try {
      await axios.post('/api/admin/login', { password });
      router.replace('/admin/creative-box');
      router.refresh();
    } catch (err) {
      message.error(
        axios.isAxiosError(err) ? err.response?.data?.message ?? 'Gagal login. Periksa koneksi.' : 'Terjadi kesalahan.',
      );
      setLoading(false);
    }
  };

  return (
    <main className={`${body.className} flex min-h-screen items-center justify-center bg-[#f6f5ff] px-4`}>
      <div className="w-full max-w-sm rounded-3xl border border-indigo-100 bg-white p-7 shadow-sm">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-xl text-violet-700">
          <LockOutlined />
        </span>
        <h1 className="text-2xl font-extrabold text-indigo-950">Login Admin</h1>
        <p className="mb-5 mt-1 text-sm text-slate-500">Khusus pengurus OSIS dan Pembina.</p>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password wajib diisi' }]}>
            <Input.Password size="large" autoFocus autoComplete="current-password" placeholder="Masukkan password admin" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Masuk
          </Button>
        </Form>
      </div>
    </main>
  );
}

export default function AdminLogin() {
  return (
    <ConfigProvider theme={adminTheme}>
      <App>
        <LoginInner />
      </App>
    </ConfigProvider>
  );
}
