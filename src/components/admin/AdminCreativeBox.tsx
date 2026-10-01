'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { App, Button, ConfigProvider, Descriptions, Drawer, Empty, Popconfirm, Select, Table, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { DeleteOutlined, LogoutOutlined, ReloadOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { body } from '@/components/creative-box/fonts';
import { adminTheme } from './theme';

/* ---------- Tipe & konstanta ---------- */
type Status = 'pending' | 'dibaca_osis' | 'disetujui_pembina' | 'ditolak';
type Kategori = 'lingkungan' | 'acara_sekolah' | 'fasilitas' | 'akademik' | 'lainnya';

interface Idea {
  id: string;
  judul_ide: string;
  kategori: Kategori;
  deskripsi_ide: string;
  detail_pengerjaan: string | null;
  manfaat: string | null;
  is_anonymous: boolean;
  nama_siswa: string | null;
  kelas: string | null;
  kontak: string | null;
  status: Status;
  created_at: string;
  updated_at: string;
}

interface ListData {
  items: Idea[];
  pagination: { page: number; limit: number; total: number };
}

const KATEGORI_LABEL: Record<Kategori, string> = {
  lingkungan: 'Lingkungan',
  acara_sekolah: 'Acara Sekolah',
  fasilitas: 'Fasilitas',
  akademik: 'Akademik',
  lainnya: 'Lainnya',
};
const STATUS_LABEL: Record<Status, string> = {
  pending: 'Menunggu',
  dibaca_osis: 'Dibaca OSIS',
  disetujui_pembina: 'Disetujui Pembina',
  ditolak: 'Ditolak',
};
const STATUS_COLOR: Record<Status, string> = {
  pending: 'default',
  dibaca_osis: 'blue',
  disetujui_pembina: 'green',
  ditolak: 'red',
};
const opts = <T extends string>(m: Record<T, string>) =>
  (Object.keys(m) as T[]).map((value) => ({ value, label: m[value] }));

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' });

interface Filters {
  kategori?: Kategori;
  status?: Status;
  is_anonymous?: 'true' | 'false';
  sort: 'terbaru' | 'terlama';
}

/* ---------- Komponen ---------- */
function AdminInner() {
  const router = useRouter();
  const { message } = App.useApp();

  const [filters, setFilters] = useState<Filters>({ sort: 'terbaru' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState<ListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Idea | null>(null);
  const [newStatus, setNewStatus] = useState<Status>('pending');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const reqId = useRef(0);

  const toLogin = useCallback(() => {
    router.replace('/admin/login');
    router.refresh();
  }, [router]);

  const load = useCallback(async () => {
    const id = ++reqId.current;
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/aspirasi/creative-box', { params: { page, limit, ...filters } });
      if (id === reqId.current) setData(res.data.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) return toLogin();
      message.error(axios.isAxiosError(err) ? err.response?.data?.message ?? 'Gagal memuat data.' : 'Terjadi kesalahan.');
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, [page, limit, filters, message, toLogin]);

  useEffect(() => {
    void load();
  }, [load]);

  const setFilter = <K extends keyof Filters>(k: K, v: Filters[K]) => {
    setFilters((f) => ({ ...f, [k]: v }));
    setPage(1);
  };

  const open = (row: Idea) => {
    setSelected(row);
    setNewStatus(row.status);
  };

  const saveStatus = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await axios.patch(`/api/admin/aspirasi/creative-box/${selected.id}`, { status: newStatus });
      message.success('Status diperbarui');
      setData((d) => d && { ...d, items: d.items.map((i) => (i.id === selected.id ? { ...i, status: newStatus } : i)) });
      setSelected((s) => s && { ...s, status: newStatus });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) return toLogin();
      message.error(axios.isAxiosError(err) ? err.response?.data?.message ?? 'Gagal menyimpan.' : 'Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: Idea) => {
    setDeletingId(row.id);
    try {
      await axios.delete(`/api/admin/aspirasi/creative-box/${row.id}`);
      message.success('Ide dihapus');
      setSelected(null);
      // Kalau itu item terakhir di halaman > 1, mundur satu halaman (efek akan memuat ulang)
      if (data && data.items.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) return toLogin();
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        message.info('Ide ini sudah tidak ada (mungkin sudah dihapus).');
        setSelected(null);
        await load();
      } else {
        message.error(axios.isAxiosError(err) ? err.response?.data?.message ?? 'Gagal menghapus.' : 'Terjadi kesalahan.');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/admin/logout');
    } finally {
      toLogin();
    }
  };

  const DeleteButton = ({ row, label }: { row: Idea; label?: string }) => (
    <Popconfirm
      title="Hapus ide ini?"
      description={`"${row.judul_ide}" akan dihapus permanen dan tidak bisa dikembalikan.`}
      okText="Ya, hapus"
      cancelText="Batal"
      okButtonProps={{ danger: true, loading: deletingId === row.id }}
      onConfirm={() => remove(row)}
      placement="left"
    >
      <Button danger size="small" icon={<DeleteOutlined />} aria-label="Hapus ide">
        {label}
      </Button>
    </Popconfirm>
  );

  const columns: TableProps<Idea>['columns'] = [
    { title: 'Tanggal', dataIndex: 'created_at', width: 160, render: (v: string) => <span className="text-xs">{fmtDate(v)}</span> },
    { title: 'Judul Ide', dataIndex: 'judul_ide', ellipsis: true, render: (v: string) => <span className="font-semibold">{v}</span> },
    { title: 'Kategori', dataIndex: 'kategori', width: 140, render: (v: Kategori) => <Tag color="purple">{KATEGORI_LABEL[v]}</Tag> },
    {
      title: 'Pengirim',
      width: 170,
      render: (_, r) =>
        r.is_anonymous ? (
          <Tag icon={<UserSwitchOutlined />}>Anonim</Tag>
        ) : (
          <span>
            {r.nama_siswa ?? <em className="text-slate-400">tanpa nama</em>}
            {r.kelas ? <span className="text-slate-400"> · {r.kelas}</span> : null}
          </span>
        ),
    },
    { title: 'Status', dataIndex: 'status', width: 160, render: (v: Status) => <Tag color={STATUS_COLOR[v]}>{STATUS_LABEL[v]}</Tag> },
    {
      title: '',
      width: 130,
      render: (_, r) => (
        // stopPropagation: klik tombol/popup tidak ikut memicu klik baris (yang membuka detail)
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="small" onClick={() => open(r)}>Detail</Button>
          <DeleteButton row={r} />
        </div>
      ),
    },
  ];

  const text = (v: string | null) =>
    v ? <Typography.Paragraph className="!mb-0 whitespace-pre-wrap">{v}</Typography.Paragraph> : <span className="text-slate-400">-</span>;

  return (
    <main className={`${body.className} min-h-screen bg-[#f6f5ff] px-4 py-6 sm:px-8`}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-indigo-950 sm:text-3xl">Creative Box · Admin</h1>
            <p className="text-sm text-slate-500">Ide kreatif yang masuk dari siswa.</p>
          </div>
          <Button icon={<LogoutOutlined />} onClick={logout}>Keluar</Button>
        </header>

        <section className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-indigo-100 bg-white p-3">
          <Select allowClear placeholder="Semua kategori" className="w-44" options={opts(KATEGORI_LABEL)} value={filters.kategori} onChange={(v) => setFilter('kategori', v)} />
          <Select allowClear placeholder="Semua status" className="w-44" options={opts(STATUS_LABEL)} value={filters.status} onChange={(v) => setFilter('status', v)} />
          <Select
            allowClear
            placeholder="Anonim & bernama"
            className="w-44"
            options={[{ value: 'true', label: 'Anonim saja' }, { value: 'false', label: 'Bernama saja' }]}
            value={filters.is_anonymous}
            onChange={(v) => setFilter('is_anonymous', v)}
          />
          <Select
            className="w-36"
            options={[{ value: 'terbaru', label: 'Terbaru dulu' }, { value: 'terlama', label: 'Terlama dulu' }]}
            value={filters.sort}
            onChange={(v) => setFilter('sort', v)}
          />
          <Button icon={<ReloadOutlined />} onClick={() => void load()} loading={loading} className="ml-auto">Muat ulang</Button>
        </section>

        <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white">
          <Table<Idea>
            rowKey="id"
            columns={columns}
            dataSource={data?.items ?? []}
            loading={loading}
            scroll={{ x: 860 }}
            locale={{ emptyText: <Empty description="Belum ada ide yang cocok" /> }}
            onRow={(r) => ({ onClick: () => open(r), className: 'cursor-pointer' })}
            pagination={{
              current: page,
              pageSize: limit,
              total: data?.pagination.total ?? 0,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
              showTotal: (t) => `${t} ide`,
              onChange: (p, s) => {
                if (s !== limit) { setLimit(s); setPage(1); } else setPage(p);
              },
            }}
          />
        </div>
      </div>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.judul_ide}
        width="min(560px, 100vw)"
        destroyOnClose
        footer={
          <div className="flex items-center gap-2">
            <Select className="flex-1" options={opts(STATUS_LABEL)} value={newStatus} onChange={setNewStatus} />
            <Button type="primary" loading={saving} disabled={newStatus === selected?.status} onClick={saveStatus}>
              Simpan status
            </Button>
            {selected && <DeleteButton row={selected} label="Hapus" />}
          </div>
        }
      >
        {selected && (
          <Descriptions column={1} size="small" layout="vertical" colon={false} labelStyle={{ fontWeight: 700 }}>
            <Descriptions.Item label="Kategori / Status">
              <Tag color="purple">{KATEGORI_LABEL[selected.kategori]}</Tag>
              <Tag color={STATUS_COLOR[selected.status]}>{STATUS_LABEL[selected.status]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Deskripsi ide">{text(selected.deskripsi_ide)}</Descriptions.Item>
            <Descriptions.Item label="Detail pengerjaan">{text(selected.detail_pengerjaan)}</Descriptions.Item>
            <Descriptions.Item label="Manfaat">{text(selected.manfaat)}</Descriptions.Item>
            <Descriptions.Item label="Pengirim">
              {selected.is_anonymous ? (
                <Tag icon={<UserSwitchOutlined />}>Anonim</Tag>
              ) : (
                <div>
                  <div>{selected.nama_siswa ?? '-'} {selected.kelas ? `· ${selected.kelas}` : ''}</div>
                  <div className="text-slate-500">{selected.kontak ?? 'Tanpa kontak'}</div>
                </div>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Dikirim">{fmtDate(selected.created_at)}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </main>
  );
}

export default function AdminCreativeBox() {
  return (
    <ConfigProvider theme={adminTheme}>
      <App>
        <AdminInner />
      </App>
    </ConfigProvider>
  );
}