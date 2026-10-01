'use client';

import { Fragment, useState, type ReactNode } from 'react';
import axios from 'axios';
import { App, Button, ConfigProvider, Form, Input, Result, Select, Steps, Switch } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BookOutlined,
  HomeOutlined,
  MailOutlined,
  SendOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { CATEGORY_VALUES, type FormValues } from '@/types/creative-box';
import { buildPayload } from '@/lib/payload';
import { body, hand } from './fonts';
import {
  Arrow,
  BlueprintStack,
  BoxIllustration,
  Bulb,
  ClipNote,
  DotGrid,
  Globe,
  GearsIcon,
  Heart,
  Leaves,
  Note,
  PageBackground,
  Smiley,
  Sparkle,
  Sprout,
  Spy,
  Squiggle,
  Star,
  Tape,
  ThanksBackdrop,
  ThanksIllustration,
  ThinCloud,
} from './decor';

/* ---------- Constants ---------- */
const CATEGORIES = CATEGORY_VALUES.map((c) => ({ value: c, label: c }));

const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ['title', 'category', 'description'],
  2: [],
  3: [],
  4: [],
};

const INITIAL: Partial<FormValues> = { isAnonymous: true };

/* ---------- Layout pieces ---------- */
const Paper = ({
  children,
  tapeSide = 'right',
  tape = true,
  wash = false,
  corner,
}: {
  children: ReactNode;
  tapeSide?: 'left' | 'right';
  tape?: boolean;
  wash?: boolean;
  corner?: ReactNode;
}) => (
  <div className="animate-step relative rounded-[28px] border border-indigo-100 bg-white/85 px-5 pb-6 pt-8 shadow-[0_14px_40px_-14px_rgba(106,95,201,0.35)] backdrop-blur-sm sm:px-8 sm:pb-8">
    {wash && (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-44 rounded-b-[28px] bg-gradient-to-t from-indigo-100/60 via-violet-50/40 to-transparent"
      />
    )}
    {tape && <Tape className={`absolute -top-3 ${tapeSide === 'right' ? 'right-8 rotate-6' : 'left-8 -rotate-6'}`} />}
    {corner ?? <Star className="absolute right-4 top-4 h-6 w-6 text-amber-300" />}
    {children}
  </div>
);

const StepHeader = ({
  icon,
  tint,
  title,
  subtitle,
}: {
  icon: ReactNode;
  tint: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) => (
  <div className="mb-6 flex items-center gap-4 pr-6">
    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl ring-4 ring-white ${tint}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <h2 className={`${hand.className} text-[28px] font-bold leading-none text-indigo-950 sm:text-[32px]`}>{title}</h2>
      {subtitle && <p className="mt-1.5 text-[13px] leading-snug text-slate-500">{subtitle}</p>}
    </div>
  </div>
);

/** Indikator langkah ringkas: label di atas, titik + garis di bawah (kanan header) */
const MiniSteps = ({ step, total }: { step: number; total: number }) => (
  <div className="flex shrink-0 flex-col items-end gap-1.5">
    <span className="text-[13px] font-semibold text-indigo-900/80">
      Langkah {step} dari {total}
    </span>
    <div
      role="progressbar"
      aria-label="Langkah pengisian"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      className="flex items-center"
    >
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const done = n <= step;
        const current = n === step;
        return (
          <Fragment key={n}>
            {i > 0 && (
              <span className={`h-[2px] w-5 transition-colors sm:w-7 ${done ? 'bg-indigo-600' : 'bg-indigo-200'}`} />
            )}
            <span
              className={`block rounded-full border-2 transition-all ${
                done ? 'border-indigo-700 bg-indigo-700' : 'border-indigo-300 bg-white'
              } ${current ? 'h-4 w-4 ring-4 ring-indigo-200/70' : 'h-3 w-3'}`}
            />
          </Fragment>
        );
      })}
    </div>
  </div>
);

const TopBar = ({ step, onBack, badge }: { step: number; onBack?: () => void; badge?: boolean }) => (
  <div className="mb-5 flex items-center justify-between gap-3">
    <div className="flex min-w-0 items-center gap-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-indigo-800 transition hover:bg-white/70 active:scale-95"
        >
          <ArrowLeftOutlined />
        </button>
      )}
      <span
        className={
          badge
            ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_-6px_rgba(106,95,201,0.5)]'
            : 'flex shrink-0'
        }
      >
        <Bulb className="h-9 w-[34px] drop-shadow-[0_0_8px_rgba(255,212,94,0.75)]" />
      </span>
      <span className="truncate text-[15px] font-extrabold text-indigo-900">Creative Box</span>
    </div>
    {step >= 1 && step <= 4 && <MiniSteps step={step} total={4} />}
  </div>
);

const SIDE_STEPS = [
  { title: 'Ide Utama', description: 'Wajib diisi' },
  { title: 'Detail Pengerjaan', description: 'Opsional' },
  { title: 'Manfaat', description: 'Opsional' },
  { title: 'Identitas', description: 'Opsional' },
];

/** Panel kiri khusus layar lebar */
const Aside = ({ step }: { step: number }) => (
  <aside className="sticky top-10 hidden lg:block">
    <div className="rounded-3xl border border-indigo-100 bg-white/70 p-6 shadow-[0_14px_40px_-14px_rgba(106,95,201,0.3)] backdrop-blur-sm">
      <p className={`${hand.className} mb-4 text-2xl font-bold text-indigo-950`}>Perjalanan idemu</p>
      <Steps direction="vertical" responsive={false} size="small" current={step - 1} items={SIDE_STEPS} />
    </div>
    <div className="animate-floaty mx-auto mt-8 w-60">
      <BoxIllustration className="h-auto w-full" />
    </div>
    <Note className="mt-1 -rotate-2 text-center !text-xl">Setiap ide berharga!</Note>
  </aside>
);

const PILL =
  'flex items-center gap-3 rounded-2xl border border-white bg-indigo-50/70 p-3 shadow-[0_2px_10px_-6px_rgba(106,95,201,0.4)]';

/* ---------- Main ---------- */
function CreativeBoxInner() {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [step, setStep] = useState(0); // 0 landing, 1-4 form, 5 sukses
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAnonymous = Form.useWatch('isAnonymous', form) ?? true;

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const next = async () => {
    try {
      await form.validateFields(STEP_FIELDS[step]);
      setStep((s) => s + 1);
      toTop();
    } catch {
      /* pesan error tampil di field */
    }
  };
  const back = () => {
    setStep((s) => s - 1);
    toTop();
  };

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const values = form.getFieldsValue(true) as FormValues;
      await axios.post('/api/aspirasi/creative-box', buildPayload(values));
      setStep(5);
      toTop();
    } catch (err) {
      message.error(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? 'Gagal mengirim ide. Periksa koneksi lalu coba lagi.'
          : 'Terjadi kesalahan. Coba lagi.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    form.resetFields();
    form.setFieldsValue(INITIAL);
    setStep(0);
  };

  /** Footer: catatan + dekorasi di kiri, tombol di kanan. Di mobile tombol tampil duluan. */
  const footer = (deco: ReactNode, opts: { last?: boolean; showBack?: boolean } = {}) => (
    <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="order-2 flex items-end gap-3 sm:order-1">{deco}</div>
      <div className="order-1 flex items-center gap-3 sm:order-2">
        {opts.showBack !== false && (
          <Button
            size="large"
            shape="round"
            icon={<ArrowLeftOutlined />}
            onClick={back}
            className="!border-[#6a5fc9] !bg-white/80 !font-semibold !text-[#6a5fc9]"
          >
            Kembali
          </Button>
        )}
        {opts.last ? (
          <Button
            type="primary"
            size="large"
            shape="round"
            icon={<SendOutlined />}
            loading={isSubmitting}
            onClick={submit}
            className="!flex-1 !font-bold !shadow-[0_10px_20px_-8px_rgba(106,95,201,0.8)] sm:!min-w-[160px] sm:!flex-none"
          >
            Kirim Ide
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            shape="round"
            onClick={next}
            className="!flex-1 !font-bold !shadow-[0_10px_20px_-8px_rgba(106,95,201,0.8)] sm:!min-w-[130px] sm:!flex-none"
          >
            Lanjut <ArrowRightOutlined />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className={`${body.className} relative min-h-[100dvh] overflow-hidden`}>
      <PageBackground />
      {step === 5 && <ThanksBackdrop />}

      <main className="relative z-10 mx-auto w-full max-w-lg px-4 pb-24 pt-5 sm:pt-10 lg:max-w-6xl lg:px-8 lg:pb-16">
        {/* ---------- 0. Landing ---------- */}
        {step === 0 && (
          <div className="animate-step">
            <TopBar step={0} />
            <div className="relative mx-auto rounded-[28px] border border-indigo-100 bg-white/70 px-5 pb-7 pt-8 shadow-[0_14px_40px_-14px_rgba(106,95,201,0.35)] backdrop-blur-sm lg:grid lg:max-w-5xl lg:grid-cols-[1.05fr_1fr] lg:gap-x-12 lg:px-14 lg:pb-14 lg:pt-14">
              <Tape className="absolute -top-3 left-8 -rotate-6" />
              {/* awan tipis & hiasan (di belakang konten) */}
              <ThinCloud className="animate-drift pointer-events-none absolute right-4 top-40 -z-10 w-40 text-indigo-100/70 lg:right-16 lg:top-28 lg:w-60" />
              <ThinCloud
                className="animate-drift pointer-events-none absolute bottom-28 left-2 -z-10 w-32 text-violet-100/70 lg:bottom-6 lg:left-[44%] lg:w-52"
                style={{ animationDelay: '-8s' }}
              />
              <ThinCloud
                className="animate-drift pointer-events-none absolute bottom-6 right-6 -z-10 hidden w-44 text-indigo-100/60 lg:block"
                style={{ animationDelay: '-13s' }}
              />
              <DotGrid className="pointer-events-none absolute right-14 top-1/2 -z-10 hidden w-16 text-violet-200 lg:block" />
              <DotGrid className="pointer-events-none absolute bottom-24 left-1/2 -z-10 hidden w-12 text-amber-200 lg:block" />
              <Sparkle className="animate-twinkle absolute left-1/2 top-10 hidden h-3.5 w-3.5 text-amber-300 lg:block" />
              <Sparkle className="animate-twinkle absolute right-1/3 top-1/2 hidden h-4 w-4 text-violet-300 lg:block" />
              <Heart className="absolute bottom-10 right-10 hidden h-5 w-5 text-pink-300 lg:block" />
              <Star className="animate-twinkle absolute bottom-28 right-16 hidden h-5 w-5 text-amber-300 lg:block" />
              <Tape className="absolute -bottom-3 right-12 rotate-[-5deg]" />
              <Note className="absolute right-4 top-3 w-28 -rotate-6 text-right !text-[17px] lg:right-10 lg:top-6 lg:w-40 lg:!text-xl">
                Ide kecil bisa jadi perubahan besar!
              </Note>
              <Sparkle className="absolute left-4 top-16 h-4 w-4 text-violet-300" />

              <div className="lg:col-start-1 lg:row-start-1">
              <h1 className={`${hand.className} mt-6 text-indigo-950 lg:mt-0`}>
                <span className="block -rotate-3 text-[30px] font-semibold leading-none lg:text-[40px]">Yuk, Bagikan</span>
                <span className="relative mt-1 block -rotate-3 text-[46px] font-bold leading-[1.05] sm:text-[52px] lg:text-[68px]">
                  Ide Kreatifmu!
                  <Squiggle className="absolute -bottom-1 left-0 h-2.5 w-40 text-amber-300" />
                </span>
              </h1>
              <p className="mt-5 max-w-[26ch] text-[15px] leading-snug text-slate-600 lg:max-w-[38ch] lg:text-lg">
                Punya ide, solusi, atau gagasan menarik? Tulis di sini dan jadi bagian dari perubahan!
              </p>
              </div>

              <div className="animate-floaty mx-auto mt-3 w-64 sm:w-72 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mt-0 lg:w-full lg:max-w-md lg:self-center">
                <BoxIllustration className="h-auto w-full" />
              </div>

              <ul className="mt-2 space-y-2.5 lg:col-start-1 lg:mt-8">
                {[
                  { i: <Bulb className="h-7 w-6" />, t: 'Ide', d: 'Langkah awal dari perubahan.', c: 'bg-amber-50' },
                  { i: <SettingOutlined className="text-xl text-indigo-600" />, t: 'Mekanisme Pengerjaan', d: 'Bagaimana cara mewujudkannya?', c: 'bg-indigo-100/70' },
                  { i: <Sprout className="h-7 w-7" />, t: 'Manfaat', d: 'Dampak positif yang akan dihasilkan.', c: 'bg-emerald-50' },
                ].map((x) => (
                  <li key={x.t} className={PILL}>
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${x.c}`}>{x.i}</span>
                    <div>
                      <p className="text-sm font-bold text-indigo-950">{x.t}</p>
                      <p className="text-xs text-slate-500">{x.d}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-between gap-3 lg:col-start-1 lg:mt-8 lg:justify-start lg:gap-8">
                <div className="flex items-center gap-1.5 lg:order-2">
                  <Note className="-rotate-3">Setiap ide berharga!</Note>
                  <Smiley className="h-4 w-4 text-indigo-400" />
                </div>
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  onClick={() => setStep(1)}
                  className="!min-w-[130px] !font-bold !shadow-[0_10px_20px_-8px_rgba(106,95,201,0.8)] lg:!order-1 lg:!h-14 lg:!min-w-[170px] lg:!text-lg"
                >
                  Mulai <ArrowRightOutlined />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- 1-4. Form (satu <Form> supaya nilai tidak hilang antar step) ---------- */}
        {step >= 1 && step <= 4 && (
          <>
            <TopBar step={step} onBack={back} />
            <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-12">
            <Aside step={step} />
            <div className="lg:max-w-2xl">
            <Form<FormValues>
              form={form}
              layout="vertical"
              initialValues={INITIAL}
              requiredMark
              size="large"
              preserve
            >
              <div key={step}>
                {step === 1 && (
                  <Paper>
                    <StepHeader
                      icon={<Bulb className="h-8 w-7" />}
                      tint="bg-amber-50"
                      title="1. Ide Utama"
                      subtitle="Ceritakan ide kreatifmu secara singkat."
                    />
                    <Form.Item
                      name="title"
                      label="Judul Ide"
                      rules={[{ required: true, whitespace: true, message: 'Judul ide wajib diisi' }]}
                    >
                      <Input placeholder="Contoh: Alat penjernih air sederhana" maxLength={120} />
                    </Form.Item>
                    <Form.Item
                      name="category"
                      label="Kategori"
                      rules={[{ required: true, message: 'Pilih salah satu kategori' }]}
                    >
                      <Select placeholder="Pilih kategori" options={CATEGORIES} />
                    </Form.Item>
                    <Form.Item
                      name="description"
                      label="Deskripsi Singkat Ide"
                      rules={[{ required: true, whitespace: true, message: 'Deskripsi ide wajib diisi' }]}
                      className="!mb-0"
                    >
                      <Input.TextArea rows={4} maxLength={500} showCount placeholder="Tulis ide kamu di sini..." />
                    </Form.Item>
                    {footer(
                      <>
                        <Note className="-rotate-3">Ide yang baik berawal dari rasa ingin tahu!</Note>
                        <Arrow className="h-6 w-14 text-indigo-400" />
                      </>,
                      { showBack: false },
                    )}
                  </Paper>
                )}

                {step === 2 && (
                  <Paper
                    tape={false}
                    wash
                    corner={
                      <>
                        <ClipNote className="absolute -top-5 right-2 h-[84px] w-16 sm:right-4 sm:h-24 sm:w-[74px]" />
                        <Sparkle className="animate-twinkle absolute right-24 top-5 h-3 w-3 text-violet-300" />
                        <Sparkle className="animate-twinkle absolute right-3 top-[92px] h-4 w-4 text-violet-300" />
                      </>
                    }
                  >
                    <Leaves className="pointer-events-none absolute -bottom-3 -left-6 h-24 w-[62px] -rotate-6" />
                    <Star className="animate-twinkle absolute -bottom-1 left-9 h-5 w-5 text-amber-300" />
                    <StepHeader
                      icon={<GearsIcon className="h-9 w-9" />}
                      tint="bg-indigo-100/70"
                      title="2. Detail Pengerjaan"
                      subtitle="Punya bayangan cara mewujudkannya? Tulis di sini (Opsional)"
                    />

                    <Form.Item name="implementation" className="!mb-0">
                      <Input.TextArea
                        autoSize={{ minRows: 6, maxRows: 14 }}
                        maxLength={1000}
                        showCount
                        placeholder="Jelaskan secara singkat bagaimana ide ini bisa diterapkan atau dijalankan..."
                        className="!resize-none"
                        style={{
                          lineHeight: '28px',
                          backgroundImage: 'repeating-linear-gradient(transparent 0 27px, #ece9fb 27px 28px)',
                          backgroundPositionY: '7px',
                          backgroundAttachment: 'local',
                        }}
                      />
                    </Form.Item>
                    {footer(
                      <div className="flex items-end gap-3 pl-8">
                        <BlueprintStack className="h-20 w-[92px] shrink-0" />
                        <Note className="-rotate-3 pb-2">
                          Jangan takut untuk berpikir besar!{' '}
                          <Smiley className="inline h-4 w-4 align-middle text-indigo-400" />
                        </Note>
                      </div>,
                    )}
                  </Paper>
                )}

                {step === 3 && (
                  <Paper>
                    <StepHeader
                      icon={<Sprout className="h-8 w-8" />}
                      tint="bg-emerald-50"
                      title="3. Manfaat"
                      subtitle="Apa manfaat utama dari ide ini?"
                    />
                    <Form.Item name="benefit" className="!mb-0">
                      <Input.TextArea
                        rows={6}
                        maxLength={1000}
                        showCount
                        placeholder="Tulis manfaat yang akan didapatkan dari ide ini..."
                      />
                    </Form.Item>
                    {footer(
                      <>
                        <Globe className="h-16 w-16 shrink-0" />
                        <Note className="-rotate-3">Ide kecil, dampaknya bisa sangat besar!</Note>
                      </>,
                    )}
                  </Paper>
                )}

                {step === 4 && (
                  <Paper tapeSide="left">
                    <StepHeader
                      icon={<UserOutlined className="text-violet-600" />}
                      tint="bg-violet-100/70"
                      title={
                        <>
                          Identitas <span className="text-lg font-semibold text-slate-500">(Opsional)</span>
                        </>
                      }
                      subtitle="Kamu bisa mengirim secara anonim atau mengisi data diri."
                    />
                    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3.5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-700 shadow-sm">
                        <Spy className="h-7 w-7" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-indigo-950">Kirim secara Anonim</p>
                        <p className="text-xs text-slate-500">Nama dan kelas tidak akan ditampilkan.</p>
                      </div>
                      <Form.Item name="isAnonymous" valuePropName="checked" noStyle>
                        <Switch aria-label="Kirim secara anonim" />
                      </Form.Item>
                    </div>

                    <div
                      className={`rounded-2xl border border-indigo-100 bg-white/70 p-4 transition-opacity ${
                        isAnonymous ? 'opacity-60' : ''
                      }`}
                    >
                      <Form.Item name="name" label="Nama">
                        <Input
                          prefix={<UserOutlined className="text-indigo-300" />}
                          disabled={isAnonymous}
                          placeholder="Masukkan nama kamu (opsional)"
                        />
                      </Form.Item>
                      <Form.Item name="className" label="Kelas">
                        <Input
                          prefix={<BookOutlined className="text-indigo-300" />}
                          disabled={isAnonymous}
                          placeholder="Contoh: 10A (opsional)"
                        />
                      </Form.Item>
                      <Form.Item name="contact" label="Email / No. HP" className="!mb-0">
                        <Input
                          prefix={<MailOutlined className="text-indigo-300" />}
                          disabled={isAnonymous}
                          placeholder="Untuk keperluan konfirmasi (opsional)"
                        />
                      </Form.Item>
                    </div>

                    {footer(
                      <>
                        <Note className="-rotate-3">Terima kasih sudah berbagi ide!</Note>
                        <Heart className="h-5 w-5 shrink-0 text-indigo-400" />
                      </>,
                      { last: true },
                    )}
                  </Paper>
                )}
              </div>
            </Form>
            </div>
            </div>
          </>
        )}

        {/* ---------- 5. Sukses ---------- */}
        {step === 5 && (
          <div className="animate-step relative mx-auto text-center lg:max-w-2xl">
            <TopBar step={5} badge />
            <Result
              status="success"
              className="!px-0 !pb-0 !pt-2"
              icon={
                <div className="animate-floaty mx-auto w-72 sm:w-80 lg:w-[26rem]">
                  <ThanksIllustration className="h-auto w-full" />
                </div>
              }
              title={
                <span
                  className={`${hand.className} -mt-2 inline-block -rotate-3 text-[56px] font-bold leading-none text-[#3b3a8c] sm:text-[68px]`}
                >
                  Terima Kasih!
                </span>
              }
              subTitle={
                <span className="mx-auto mt-1 block max-w-[30ch] text-[15px] leading-relaxed">
                  <b className="block font-extrabold text-indigo-950">Ide kamu sudah berhasil dikirim.</b>
                  <span className="text-indigo-700/80">
                    Setiap gagasan berarti, bersama kita bisa membuat perubahan!
                  </span>
                </span>
              }
              extra={
                <Button
                  size="large"
                  shape="round"
                  icon={<HomeOutlined />}
                  onClick={reset}
                  className="!h-12 !min-w-[230px] !border-[#6a5fc9] !bg-white/70 !font-semibold !text-[#6a5fc9] backdrop-blur"
                >
                  Kembali ke Beranda
                </Button>
              }
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function CreativeBox() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6a5fc9',
          borderRadius: 14,
          colorBorder: '#dcd9f7',
          colorTextPlaceholder: '#a9a6c9',
          colorText: '#2b2a5c',
          controlHeightLG: 48,
          fontFamily: 'inherit',
        },
        components: {
          Form: { labelColor: '#2b2a5c', verticalLabelPadding: '0 0 6px' },
          Steps: { dotSize: 10, dotCurrentSize: 12 },
        },
      }}
    >
      <App>
        <CreativeBoxInner />
      </App>
    </ConfigProvider>
  );
}