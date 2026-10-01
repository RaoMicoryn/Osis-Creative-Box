export interface FormValues {
  title: string;
  category: string;
  description: string;
  implementation?: string;
  benefit?: string;
  isAnonymous: boolean;
  name?: string;
  className?: string;
  contact?: string;
}

export interface CreativeBoxPayload {
  idea: { title: string; category: string; description: string };
  implementation: { description: string } | null;
  benefit: { description: string } | null;
  submitter: {
    isAnonymous: boolean;
    name: string | null;
    className: string | null;
    contact: string | null;
  };
  meta: { submittedAt: string; source: 'creative-box-web' };
}

export const CATEGORY_VALUES = [
  'Lingkungan',
  'Acara Sekolah',
  'Fasilitas',
  'Akademik',
  'Lainnya',
] as const;
