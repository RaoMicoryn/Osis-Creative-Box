import type { CreativeBoxPayload, FormValues } from '@/types/creative-box';

const clean = (v?: string) => (v && v.trim() ? v.trim() : null);

export function buildPayload(v: FormValues): CreativeBoxPayload {
  const anon = v.isAnonymous;
  const impl = clean(v.implementation);
  const benefit = clean(v.benefit);

  return {
    idea: {
      title: v.title.trim(),
      category: v.category,
      description: v.description.trim(),
    },
    implementation: impl ? { description: impl } : null,
    benefit: benefit ? { description: benefit } : null,
    submitter: {
      isAnonymous: anon,
      name: anon ? null : clean(v.name),
      className: anon ? null : clean(v.className),
      contact: anon ? null : clean(v.contact),
    },
    meta: { submittedAt: new Date().toISOString(), source: 'creative-box-web' },
  };
}
