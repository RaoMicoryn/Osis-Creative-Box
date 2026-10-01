import type { CSSProperties, ReactNode } from 'react';
import { hand } from './fonts';

type P = { className?: string };

/* ---------- Kecil-kecil: sparkle, bintang, tape ---------- */
export const Sparkle = ({ className = '' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="M12 0c.8 7 5 11.2 12 12-7 .8-11.2 5-12 12-.8-7-5-11.2-12-12 7-.8 11.2-5 12-12z" />
  </svg>
);

export const Star = ({ className = '' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      d="M12 2.5l2.9 6.1 6.7.8-4.9 4.6 1.3 6.6L12 17.3l-6 3.3 1.3-6.6L2.4 9.4l6.7-.8z"
      fill="currentColor"
      stroke="#f0a63a"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

export const Tape = ({ className = '' }: P) => (
  <div
    aria-hidden
    className={`h-6 w-20 bg-violet-200/70 shadow-sm ${className}`}
    style={{
      clipPath:
        'polygon(0 0,100% 0,97% 25%,100% 50%,97% 75%,100% 100%,0 100%,3% 75%,0 50%,3% 25%)',
      backgroundImage:
        'repeating-linear-gradient(135deg, rgba(255,255,255,.35) 0 4px, transparent 4px 8px)',
    }}
  />
);

export const Heart = ({ className = '' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20s-7-4.5-8.5-9A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.5 4C19 15.5 12 20 12 20z" />
  </svg>
);

export const Smiley = ({ className = '' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 14c1 1.5 2 2 3.5 2s2.5-.5 3.5-2" />
    <circle cx="9" cy="10" r=".6" fill="currentColor" />
    <circle cx="15" cy="10" r=".6" fill="currentColor" />
  </svg>
);

/** Panah lengkung ala coretan tangan */
export const Arrow = ({ className = '' }: P) => (
  <svg viewBox="0 0 80 32" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 24C18 6 46 4 72 14" />
    <path d="M63 6l10 8-12 5" />
  </svg>
);

export const Squiggle = ({ className = '' }: P) => (
  <svg viewBox="0 0 180 12" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
    <path d="M3 8C30 0 60 14 90 6s60-4 87 2" />
  </svg>
);

/* ---------- Catatan tulisan tangan ---------- */
export const Note = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <p className={`${hand.className} text-[19px] font-semibold leading-[1.1] text-indigo-900/75 ${className}`}>
    {children}
  </p>
);

/* ---------- Daun ---------- */
const LEAF = 'M0 0C-14-10-16-34 0-46 16-34 14-10 0 0z';
const Leaf = ({ t, fill }: { t: string; fill: string }) => (
  <g transform={t}>
    <path d={LEAF} fill={fill} />
    <path d="M0 0V-36" stroke="#fff" strokeOpacity=".45" strokeWidth="1.5" />
  </g>
);

const LeavesShape = () => (
  <>
    <path d="M55 148C50 110 46 70 60 8" stroke="#5aa27d" strokeWidth="3" fill="none" strokeLinecap="round" />
    <Leaf t="translate(52 122) rotate(-55)" fill="#7fbf94" />
    <Leaf t="translate(50 100) rotate(50) scale(.9)" fill="#4fa08f" />
    <Leaf t="translate(52 78) rotate(-45) scale(.85)" fill="#9ad0a8" />
    <Leaf t="translate(56 56) rotate(45) scale(.8)" fill="#5fb39a" />
    <Leaf t="translate(58 34) rotate(-30) scale(.7)" fill="#7fbf94" />
    <Leaf t="translate(60 12) scale(.6)" fill="#4fa08f" />
  </>
);

export const Leaves = ({ className = '' }: P) => (
  <svg viewBox="0 -20 110 170" className={className} aria-hidden>
    <LeavesShape />
  </svg>
);

/* ---------- Ikon bulat untuk header ---------- */
const BulbShape = () => (
  <>
    <defs>
      <radialGradient id="cbBulbG" cx=".38" cy=".3" r=".85">
        <stop offset="0" stopColor="#fffbe3" />
        <stop offset=".35" stopColor="#ffe47e" />
        <stop offset=".75" stopColor="#ffc93f" />
        <stop offset="1" stopColor="#f6a828" />
      </radialGradient>
      <linearGradient id="cbBulbBase" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#f1effc" />
        <stop offset=".5" stopColor="#c3bfec" />
        <stop offset="1" stopColor="#8f8ac9" />
      </linearGradient>
    </defs>
    <g stroke="#f7c948" strokeWidth="4" strokeLinecap="round">
      <path d="M50-8v-9M12 6L6-1M88 6l6-7M-2 36h-8M102 36h8" />
    </g>
    <g transform="translate(10 0)">
      {/* kaca */}
      <path d="M40 6C22 6 10 19 10 35c0 11 6 19 12 25 4 4 5 8 5 12h26c0-4 1-8 5-12 6-6 12-14 12-25C70 19 58 6 40 6z" fill="url(#cbBulbG)" stroke="#f0a63a" strokeWidth="2.2" strokeLinejoin="round" />
      {/* pendar cahaya filamen */}
      <ellipse cx="40" cy="48" rx="11" ry="9" fill="#fff8d0" opacity=".7" />
      {/* filamen */}
      <path d="M34 74V54M46 74V54" stroke="#d98a2b" strokeWidth="2" strokeLinecap="round" />
      <path d="M34 54c1-6 3-6 4.5 0s3.5 6 4.5 0 2-6 3 0" stroke="#ff9a1f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* kilau kaca */}
      <path d="M20 30c1.5-9 9-15 17-15.5" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity=".9" />
      <circle cx="20.5" cy="39" r="2.2" fill="#fff" opacity=".85" />
      <path d="M62 38c-.5 6-3 10-7 14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".45" />
      {/* ulir logam */}
      <rect x="26" y="73" width="28" height="7" rx="2.5" fill="url(#cbBulbBase)" stroke="#a9a5dc" strokeWidth=".8" />
      <rect x="27.5" y="80.5" width="25" height="7" rx="2.5" fill="url(#cbBulbBase)" stroke="#a9a5dc" strokeWidth=".8" />
      <path d="M31 89h18c0 4-3 7-9 7s-9-3-9-7z" fill="#6f6bb0" />
    </g>
  </>
);

export const Bulb = ({ className = '' }: P) => (
  <svg viewBox="-12 -20 124 130" className={className} aria-hidden>
    <BulbShape />
  </svg>
);

export const Sprout = ({ className = '' }: P) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <path d="M32 58V30" stroke="#3f8f6b" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M32 34C16 34 8 24 8 12c14 0 24 6 24 22z" fill="#6fbf8b" />
    <path d="M32 28c0-14 8-22 24-22 0 12-8 22-24 22z" fill="#4fa08f" />
    <path d="M20 58h24" stroke="#3f8f6b" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const Spy = ({ className = '' }: P) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18h28M11 18l3-9h12l3 9" />
    <circle cx="14" cy="27" r="4.5" />
    <circle cx="26" cy="27" r="4.5" />
    <path d="M18.5 26.5c1-1 2-1 3 0" />
  </svg>
);

export const Globe = ({ className = '' }: P) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <circle cx="32" cy="32" r="26" fill="#7cc0ee" stroke="#3f7fb5" strokeWidth="2.5" />
    <path d="M16 20c6-6 14-4 16 2s-6 8-4 14-10 6-14-2c-3-6-3-10 2-14zM38 38c6-2 12 0 12 6s-6 10-10 6-4-10-2-12z" fill="#7fcf8f" />
    <path d="M14 12c6-3 10-4 14-4" stroke="#fff" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

export const Notebook = ({ className = '' }: P) => (
  <svg viewBox="0 0 72 72" className={className} aria-hidden>
    <g transform="rotate(-8 36 36)">
      <rect x="8" y="10" width="46" height="52" rx="5" fill="#fff" stroke="#8d86dc" strokeWidth="2.5" />
      <rect x="8" y="10" width="10" height="52" rx="4" fill="#a59de8" />
      <path d="M26 24h20M26 32h20M26 40h14" stroke="#cfcdee" strokeWidth="3" strokeLinecap="round" />
      <circle cx="43" cy="49" r="4" fill="#ffd45e" />
    </g>
    <g transform="rotate(38 56 22)">
      <rect x="52" y="4" width="7" height="34" rx="1.5" fill="#e2a06b" />
      <path d="M52 38h7l-3.5 8z" fill="#f6d9b0" />
    </g>
  </svg>
);

const PlaneShape = () => (
  <>
    <path d="M2 46C12 30 26 34 38 24" stroke="#8d86dc" strokeWidth="1.8" strokeDasharray="3 5" strokeLinecap="round" />
    <path d="M40 20L86 4 70 44 58 30z" fill="#fff" stroke="#6a5fc9" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M58 30L86 4M58 30l-2 12 8-8" stroke="#6a5fc9" strokeWidth="2.2" strokeLinejoin="round" />
  </>
);

export const PaperPlane = ({ className = '' }: P) => (
  <svg viewBox="0 0 90 50" className={className} aria-hidden fill="none">
    <PlaneShape />
  </svg>
);

/* ---------- Ikon roda gigi (mekanisme) ---------- */
const gearPath = (cx: number, cy: number, teeth: number, ro: number, ri: number, hole: number) => {
  const step = (Math.PI * 2) / teeth;
  const P = (a: number, r: number) => `${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)}`;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    d += `${i === 0 ? 'M' : 'L'}${P(a - step * 0.4, ri)}L${P(a - step * 0.26, ro)}L${P(a + step * 0.26, ro)}L${P(a + step * 0.4, ri)}`;
  }
  return `${d}ZM${cx + hole} ${cy}a${hole} ${hole} 0 1 0 ${-hole * 2} 0a${hole} ${hole} 0 1 0 ${hole * 2} 0z`;
};
const GEAR_BIG = gearPath(15, 15, 8, 13, 10.5, 4.6);
const GEAR_SMALL = gearPath(31, 31, 6, 8, 6.2, 2.8);

export const GearsIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden>
    <path d={GEAR_BIG} fillRule="evenodd" fill="#6a5fc9" stroke="#5348b3" strokeWidth="1" strokeLinejoin="round" />
    <path d={GEAR_SMALL} fillRule="evenodd" fill="#f7c948" stroke="#e5a92f" strokeWidth="1" strokeLinejoin="round" />
    <path d="M9 9.5a8 8 0 0 1 5-3" stroke="#fff" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" fill="none" />
  </svg>
);

/* ---------- Klip + kertas gantung (pojok kartu Detail Pengerjaan) ---------- */
export const ClipNote = ({ className = '' }: P) => (
  <svg viewBox="0 0 70 92" className={className} aria-hidden>
    <g transform="rotate(7 35 52)">
      <path d="M12 22h38a4 4 0 0 1 4 4v46L43 83H12a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4z" fill="#3a3380" opacity=".18" transform="translate(2 3)" />
      <path d="M12 20h38a4 4 0 0 1 4 4v46L43 81H12a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4z" fill="#f7f6ff" stroke="#cfc9f0" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M43 81v-8a4 4 0 0 1 4-4h7z" fill="#e6e2fb" stroke="#cfc9f0" strokeWidth="1" strokeLinejoin="round" />
      <path d="M15 36h28M15 44h22" stroke="#cfc9f0" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="21" cy="60" r="4.5" fill="#ffd45e" stroke="#f0a63a" strokeWidth="1.2" />
      <path d="M28 60h6M31.5 56.5L35 60l-3.5 3.5" stroke="#8f84e3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="38" y="55" width="10" height="10" rx="3" fill="#a79df3" />
      <path d="M24 12c-6-12 22-12 16 0" stroke="#9d98d6" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M22 11h26l-3.5 15h-19z" fill="#6a5fc9" />
      <path d="M26 14h8" stroke="#fff" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

/* ---------- Tumpukan kertas blueprint (alur ide -> mekanisme -> hasil) ---------- */
export const BlueprintStack = ({ className = '' }: P) => (
  <svg viewBox="0 0 96 84" className={className} aria-hidden>
    <g transform="rotate(9 48 42)">
      <rect x="16" y="8" width="60" height="64" rx="6" fill="#d9d4fb" stroke="#bdb6f0" />
    </g>
    <g transform="rotate(-7 48 42)">
      <rect x="14" y="10" width="62" height="64" rx="6" fill="#b2a9f4" stroke="#9d93ec" />
      <rect x="8" y="20" width="10" height="8" rx="2" fill="#f9a8c0" />
      <rect x="8" y="34" width="10" height="8" rx="2" fill="#ffd45e" />
      <rect x="8" y="48" width="10" height="8" rx="2" fill="#a5d6c0" />
    </g>
    <g transform="rotate(2 48 42)">
      <rect x="20" y="14" width="58" height="60" rx="5" fill="#fff" stroke="#c9c5ee" />
      <path d="M20 30h58M20 46h58M20 62h58M36 14v60M52 14v60M68 14v60" stroke="#ece9fb" strokeWidth="1" />
      <path d="M26 22h22" stroke="#8f84e3" strokeWidth="3" strokeLinecap="round" />
      <circle cx="30" cy="44" r="5" fill="#ffd45e" stroke="#f0a63a" strokeWidth="1.2" />
      <path d="M36.5 44h5M40 41.5l2.5 2.5-2.5 2.5" stroke="#8f84e3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="44" y="39" width="11" height="10" rx="3" fill="#a79df3" />
      <path d="M56.5 44h4M59 41.5l2.5 2.5-2.5 2.5" stroke="#8f84e3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="68" cy="44" r="5" fill="#7fcf9a" />
      <path d="M65.5 44l1.8 1.8 3.2-3.6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M27 66l8-6 8 3 9-9 9 4" stroke="#7c6fe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="35" cy="60" r="1.8" fill="#7c6fe0" />
      <circle cx="52" cy="54" r="1.8" fill="#7c6fe0" />
    </g>
    <g transform="translate(72 48) rotate(38)">
      <rect x="0" y="0" width="6" height="30" rx="1.5" fill="#7c6fe0" />
      <rect x="0" y="0" width="2.5" height="30" fill="#a79df3" />
      <polygon points="0,30 6,30 3,37" fill="#f6d9b0" />
      <polygon points="1.6,34 4.4,34 3,37" fill="#3b3470" />
    </g>
    <path d={SPARK} transform="translate(76 2) scale(.4)" fill="#f7c948" />
  </svg>
);

/* ---------- Step 3 (Manfaat): ikon tunas, lencana, bumi dirawat daun ---------- */
export const GrowthIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden>
    <ellipse cx="20" cy="33.5" rx="13" ry="4" fill="#c9966a" />
    <ellipse cx="20" cy="32.5" rx="11" ry="3" fill="#dcae85" />
    <path d="M20 32V17" stroke="#3f8f6b" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M20 23C12 23 8 18 8 11c7 0 12 4 12 12z" fill="#6fbf8b" />
    <path d="M20 18c0-8 5-12 13-12 0 7-5 12-13 12z" fill="#4fa08f" />
    <path d="M12 15l6 6M24 12l-3 4" stroke="#fff" strokeOpacity=".45" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M32 22q3 4 0 6-3-2 0-6z" fill="#8cc9f2" />
    <path d={SPARK} transform="translate(4 24) scale(.3)" fill="#ffd45e" />
  </svg>
);

export const BadgeSticker = ({ className = '' }: P) => (
  <svg viewBox="0 0 60 80" className={className} aria-hidden>
    <path d="M18 42L9 74l13-7 7 9 4-34z" fill="#8f84e3" />
    <path d="M42 42l9 32-13-7-7 9-4-34z" fill="#6a5fc9" />
    <circle cx="30" cy="28" r="23" fill="#ffd45e" stroke="#f0a63a" strokeWidth="2.5" />
    <circle cx="30" cy="28" r="23" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="1.6" strokeDasharray="1.5 4" strokeLinecap="round" transform="scale(.86) translate(4.9 4.6)" />
    <circle cx="30" cy="28" r="16" fill="#ffe58a" />
    <path d={OSTAR} transform="translate(16.5 14.5) scale(1.15)" fill="#fff" stroke="#f0a63a" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

export const EarthCare = ({ className = '' }: P) => (
  <svg viewBox="0 0 96 84" className={className} aria-hidden>
    <circle cx="48" cy="42" r="36" fill="#dff3ff" opacity=".6" />
    <path d="M48 16V9" stroke="#3f8f6b" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M48 12c-8 0-11-5-11-10 7 0 11 4 11 10z" fill="#6fbf8b" />
    <path d="M48 10c0-8 5-12 12-12 0 7-4 12-12 12z" fill="#4fa08f" transform="translate(0 2)" />
    <circle cx="48" cy="42" r="26" fill="#7cc0ee" stroke="#3f7fb5" strokeWidth="2.5" />
    <path d="M30 32c5-6 12-4 14 2s-5 7-3 12-9 5-12-2c-2-5-2-8 1-12zM54 48c5-2 10 0 10 5s-5 8-8 5-3-8-2-10z" fill="#7fcf8f" />
    <path d="M32 24c5-4 9-5 13-5" stroke="#fff" strokeOpacity=".65" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M8 58c3 12 18 20 34 16C38 62 24 54 8 58z" fill="#6fbf8b" />
    <path d="M88 58c-3 12-18 20-34 16 4-12 18-20 34-16z" fill="#4fa08f" />
    <path d="M14 62c8 2 17 6 23 11M82 62c-8 2-17 6-23 11" stroke="#fff" strokeOpacity=".45" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    <path transform="translate(76 14) scale(.55)" d="M12 20s-7-4.5-8.5-9A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.5 4C19 15.5 12 20 12 20z" fill="#ffc2d4" stroke="#f58fb0" strokeWidth="1.8" strokeLinejoin="round" />
    <path transform="translate(8 22) scale(.4)" d="M12 20s-7-4.5-8.5-9A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.5 4C19 15.5 12 20 12 20z" fill="#ffc2d4" stroke="#f58fb0" strokeWidth="2.2" strokeLinejoin="round" />
    <path d={SPARK} transform="translate(82 40) scale(.45)" fill="#ffd45e" />
    <path d={SPARK} transform="translate(4 44) scale(.35)" fill="#c4bdf5" />
  </svg>
);

/* ---------- Step 4 (Identitas): ikon privasi, ID card gantung, amplop terbang ---------- */
export const PrivacyIcon = ({ className = '' }: P) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden>
    <circle cx="16" cy="13" r="6.5" fill="#8f84e3" />
    <path d="M4 33c0-9 5.5-13 12-13s12 4 12 13z" fill="#a79df3" />
    <path d="M30 17l8.5 3v7.5c0 5.5-4.2 8.8-8.5 10.5-4.3-1.7-8.5-5-8.5-10.5V20z" fill="#6a5fc9" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M26.2 27.5l2.8 2.8 5-5.6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/** ID card gantung. `anonymous` = foto ditutup kacamata/topi & data diganti garis putus-putus */
export const IdCard = ({ className = '', anonymous = true }: P & { anonymous?: boolean }) => (
  <svg viewBox="0 -4 70 104" className={className} aria-hidden>
    <path d="M20-4l15 28 15-28" stroke="#8f84e3" strokeWidth="6" fill="none" strokeLinejoin="round" />
    <rect x="30" y="22" width="10" height="9" rx="2" fill="#6a5fc9" />
    <rect x="9" y="34" width="54" height="64" rx="7" fill="#3a3380" opacity=".18" />
    <rect x="8" y="31" width="54" height="64" rx="7" fill="#fff" stroke="#cfc9f0" strokeWidth="1.3" />
    <rect x="27" y="35" width="16" height="4" rx="2" fill="#e6e2fb" />
    {anonymous ? (
      <>
        <circle cx="35" cy="56" r="11" fill="#e6e2fb" />
        <path d="M27 54h16M29.5 54l2-6h7l2 6" stroke="#6a5fc9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="31" cy="60" r="2.8" fill="none" stroke="#6a5fc9" strokeWidth="1.6" />
        <circle cx="39" cy="60" r="2.8" fill="none" stroke="#6a5fc9" strokeWidth="1.6" />
        <path d="M17 75h36M21 83h28M25 90h20" stroke="#cfc9f0" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 5" />
      </>
    ) : (
      <>
        <circle cx="35" cy="56" r="11" fill="#a79df3" />
        <circle cx="35" cy="52.5" r="4.2" fill="#fff" />
        <path d="M27 63c1-5 4-6.5 8-6.5s7 1.5 8 6.5a11 11 0 0 1-16 0z" fill="#fff" />
        <path d="M17 75h36" stroke="#6a5fc9" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M21 83h28" stroke="#cfc9f0" strokeWidth="3" strokeLinecap="round" />
        <path d="M25 90h20" stroke="#e6e2fb" strokeWidth="3" strokeLinecap="round" />
      </>
    )}
  </svg>
);

export const SendOff = ({ className = '' }: P) => (
  <svg viewBox="0 0 110 84" className={className} aria-hidden>
    <ellipse cx="42" cy="78" rx="34" ry="4" fill="#8f86dc" opacity=".25" />
    <rect x="12" y="36" width="60" height="40" rx="6" fill="#fff" stroke="#c9c5ee" strokeWidth="1.5" />
    <path d="M12 74l22-20M72 74L50 54" stroke="#e3dffa" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M13 40l29 22 29-22" fill="#ece9ff" stroke="#8f84e3" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    <path transform="translate(33 52) scale(.7)" d="M12 20s-7-4.5-8.5-9A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.5 4C19 15.5 12 20 12 20z" fill="#ff8fb1" stroke="#f0668f" strokeWidth="1.5" strokeLinejoin="round" />
    <svg x="60" y="0" width="48" height="27" viewBox="0 0 90 50" fill="none">
      <PlaneShape />
    </svg>
    <path d={SPARK} transform="translate(2 20) scale(.5)" fill="#ffd45e" />
    <path d={SPARK} transform="translate(90 54) scale(.4)" fill="#c4bdf5" />
    <path transform="translate(80 36) scale(.45)" d="M12 20s-7-4.5-8.5-9A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.5 4C19 15.5 12 20 12 20z" fill="#ffc2d4" stroke="#f58fb0" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="100" cy="40" r="2" fill="#f9a8c0" />
  </svg>
);

/* ---------- Gelembung sapaan + stiker smiley (langkah Identitas) ---------- */
export const HelloBubble = ({ className = '' }: P) => (
  <svg viewBox="0 0 96 72" className={className} aria-hidden>
    <ellipse cx="46" cy="67" rx="30" ry="3.5" fill="#8f86dc" opacity=".22" />
    <path d="M10 10h50a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H34l-12 11v-11h-12a8 8 0 0 1-8-8V18a8 8 0 0 1 8-8z" fill="#fff" stroke="#c9c5ee" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="20" cy="29" r="3" fill="#a79df3" />
    <circle cx="31" cy="29" r="3" fill="#8f84e3" />
    <circle cx="42" cy="29" r="3" fill="#6a5fc9" />
    <g transform="translate(66 38)">
      <circle r="17" fill="#ffd45e" stroke="#f0a63a" strokeWidth="2" />
      <ellipse cx="-6" cy="-3" rx="2.2" ry="3" fill="#3b3470" />
      <ellipse cx="6" cy="-3" rx="2.2" ry="3" fill="#3b3470" />
      <circle cx="-6.7" cy="-4.2" r=".8" fill="#fff" />
      <circle cx="5.3" cy="-4.2" r=".8" fill="#fff" />
      <ellipse cx="-11" cy="4" rx="3.5" ry="2" fill="#ff9db7" opacity=".7" />
      <ellipse cx="11" cy="4" rx="3.5" ry="2" fill="#ff9db7" opacity=".7" />
      <path d="M-6 4q6 7 12 0" stroke="#3b3470" strokeWidth="2" strokeLinecap="round" fill="none" />
    </g>
    <path d={SPARK} transform="translate(78 4) scale(.4)" fill="#f7c948" />
    <path d={SPARK} transform="translate(2 52) scale(.35)" fill="#c4bdf5" />
  </svg>
);

/* ---------- Awan tipis & hiasan ---------- */
const CloudShape = () => (
  <>
    <ellipse cx="100" cy="60" rx="92" ry="16" />
    <circle cx="58" cy="46" r="21" />
    <circle cx="100" cy="34" r="29" />
    <circle cx="146" cy="46" r="20" />
  </>
);

/** Awan tipis: warnanya ikut `text-*` (pakai opacity rendah biar tidak tebal) */
export const ThinCloud = ({ className = '', style }: P & { style?: CSSProperties }) => (
  <svg viewBox="0 0 200 80" className={className} style={style} aria-hidden fill="currentColor">
    <CloudShape />
  </svg>
);

export const DotGrid = ({ className = '' }: P) => (
  <svg viewBox="0 0 60 40" className={className} aria-hidden fill="currentColor">
    {[0, 1, 2, 3, 4].flatMap((i) =>
      [0, 1, 2, 3].map((j) => <circle key={`${i}-${j}`} cx={6 + i * 12} cy={6 + j * 9.5} r="1.8" />),
    )}
  </svg>
);

export const Cloud = ({ className = '' }: P) => (
  <svg viewBox="0 0 320 200" className={className} aria-hidden>
    <g fill="#e6e4ff">
      <ellipse cx="160" cy="130" rx="140" ry="55" />
      <circle cx="90" cy="105" r="55" />
      <circle cx="170" cy="80" r="70" />
      <circle cx="240" cy="110" r="50" />
    </g>
    <g fill="#f4f3ff" opacity=".8">
      <circle cx="160" cy="70" r="50" />
    </g>
  </svg>
);

/* ---------- Ilustrasi kotak (landing) ---------- */
const SPARK = 'M12 0c.8 7 5 11.2 12 12-7 .8-11.2 5-12 12-.8-7-5-11.2-12-12 7-.8 11.2-5 12-12z';
const FUR = '#e6d2ba';
const GINGER = '#f4a259';
const GINGER_DK = '#dd8438';

export const BoxIllustration = ({ className = '' }: P) => (
  <svg
    viewBox="-34 -26 300 266"
    className={`${className} ${hand.className}`}
    role="img"
    aria-label="Kotak Creative Box berisi lampu ide dan kucing"
  >
    <defs>
      <linearGradient id="cbFaceL" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8b80e8" />
        <stop offset="1" stopColor="#6558c7" />
      </linearGradient>
      <linearGradient id="cbFaceR" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6a5fc9" />
        <stop offset="1" stopColor="#4a40a3" />
      </linearGradient>
      <linearGradient id="cbInside" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#332c80" />
        <stop offset="1" stopColor="#4a42a6" />
      </linearGradient>
      <linearGradient id="cbFlap" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b3aaf3" />
        <stop offset="1" stopColor="#8f84e3" />
      </linearGradient>
      <radialGradient id="cbGlow">
        <stop offset="0" stopColor="#fff4b8" stopOpacity=".95" />
        <stop offset=".55" stopColor="#ffe58a" stopOpacity=".35" />
        <stop offset="1" stopColor="#ffe58a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cbBlob">
        <stop offset="0" stopColor="#e4e1ff" />
        <stop offset="1" stopColor="#e4e1ff" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="cbFur" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fffefb" />
        <stop offset="1" stopColor="#f6eee4" />
      </linearGradient>
      <clipPath id="cbHead">
        <path d="M-34 6C-36-14-20-27 0-27S36-14 34 6C34 22 18 31 0 31S-34 22-34 6Z" />
      </clipPath>
      <clipPath id="cbBody">
        <ellipse cx="156" cy="106" rx="31" ry="27" />
      </clipPath>
    </defs>

    {/* latar lembut + bayangan */}
    <ellipse cx="118" cy="120" rx="150" ry="118" fill="url(#cbBlob)" />
    <ellipse cx="115" cy="210" rx="98" ry="10" fill="#8f86dc" opacity=".3" />

    {/* awan tipis di belakang */}
    <g fill="#ebe8ff" opacity=".9">
      <g transform="translate(-30 12) scale(.36)"><CloudShape /></g>
      <g transform="translate(92 -26) scale(.32)"><CloudShape /></g>
      <g transform="translate(192 158) scale(.34)"><CloudShape /></g>
    </g>

    {/* doodle melayang: lingkaran, plus, hati, confetti */}
    <g stroke="#c4bdf5" strokeWidth="1.6" fill="none" strokeLinecap="round">
      <circle cx="252" cy="22" r="4.5" />
      <circle cx="4" cy="-14" r="3" />
      <circle cx="-24" cy="84" r="3.5" />
      <circle cx="238" cy="196" r="3" />
      <path d="M214 24v8M210 28h8" />
      <path d="M-26 56v7M-29.5 59.5h7" />
      <path d="M60 -20v6M57 -17h6" />
    </g>
    <path transform="translate(244 112) scale(.5)" d="M12 20s-7-4.5-8.5-9A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.5 4C19 15.5 12 20 12 20z" fill="#ffc2d4" stroke="#f58fb0" strokeWidth="1.6" strokeLinejoin="round" />
    <path transform="translate(-14 100) scale(.4)" d="M12 20s-7-4.5-8.5-9A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.5 4C19 15.5 12 20 12 20z" fill="#ffc2d4" stroke="#f58fb0" strokeWidth="2" strokeLinejoin="round" />
    <rect x="246" y="-10" width="5" height="9" rx="1.5" fill="#f9a8c0" transform="rotate(30 248 -5)" />
    <rect x="-8" y="66" width="5" height="9" rx="1.5" fill="#a5d6c0" transform="rotate(-25 -5 70)" />
    <rect x="30" y="-14" width="5" height="9" rx="1.5" fill="#ffd45e" transform="rotate(20 32 -10)" />
    <circle cx="150" cy="-18" r="1.8" fill="#c4bdf5" />
    <circle cx="222" cy="140" r="1.8" fill="#f7c948" />
    <circle cx="-20" cy="20" r="1.8" fill="#f9a8c0" />

    {/* bintang & sparkle */}
    <path d={SPARK} transform="translate(-16 34) scale(.6)" fill="#c4bdf5" />
    <path d={SPARK} transform="translate(240 52) scale(.45)" fill="#f7c948" />
    <path d={SPARK} transform="translate(-4 4) scale(.4)" fill="#f7c948" />
    <path d={SPARK} transform="translate(224 118) scale(.5)" fill="#c4bdf5" />

    {/* pesawat kertas */}
    <svg x="170" y="-20" width="66" height="37" viewBox="0 0 90 50" fill="none">
      <PlaneShape />
    </svg>

    {/* tutup belakang & bagian dalam */}
    <polygon points="42,84 112,62 132,76 62,98" fill="url(#cbFlap)" />
    <polygon points="118,62 190,80 176,98 108,76" fill="url(#cbFlap)" opacity=".9" />
    <polygon points="22,104 112,128 204,98 116,74" fill="url(#cbInside)" />

    {/* cahaya lampu */}
    <circle cx="100" cy="42" r="56" fill="url(#cbGlow)" />

    {/* pensil: warna senada dengan kotak (ungu) + aksen emas */}
    <g transform="translate(-24 -8) rotate(-12 56 70)">
      <rect x="48" y="40" width="6" height="72" fill="#a79df3" />
      <rect x="54" y="40" width="6" height="72" fill="#7c6fe0" />
      <rect x="60" y="40" width="4" height="72" fill="#5f54c4" />
      <path d="M51.5 52V94" stroke="#fff" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="48" y="45" width="16" height="6" fill="#f7c948" />
      <path d="M48 47.2h16M48 49.2h16" stroke="#e5a92f" strokeWidth=".8" />
      <path d="M52 66l1 2.5 2.5.4-1.8 1.7.5 2.6-2.2-1.3-2.2 1.3.5-2.6-1.8-1.7 2.5-.4z" fill="#fff" opacity=".85" transform="translate(5 2)" />
      <polygon points="48,40 56,40 56,12" fill="#f9e5c6" />
      <polygon points="56,40 64,40 56,12" fill="#edc994" />
      <polygon points="53.5,20 58.5,20 56,12" fill="#3b3470" />
      <path d="M48 40h16" stroke="#d9a76c" strokeWidth="1" />
    </g>

    {/* lampu ide (di belakang kertas) */}
    <g transform="translate(65 11) scale(.7)">
      <BulbShape />
    </g>

    {/* kertas catatan: sticky note dengan sudut terlipat */}
    <g transform="translate(-2 4) rotate(-7 87 93)">
      <path d="M68 69h40a5 5 0 0 1 5 5v37l-12 12H68a5 5 0 0 1-5-5V74a5 5 0 0 1 5-5z" fill="#3a3380" opacity=".28" />
      <path d="M67 66h40a5 5 0 0 1 5 5v37l-12 12H67a5 5 0 0 1-5-5V71a5 5 0 0 1 5-5z" fill="#fffdf5" stroke="#e0dbf7" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M100 120v-8a4 4 0 0 1 4-4h8z" fill="#ebe6fc" stroke="#d6d0f3" strokeWidth="1" strokeLinejoin="round" />
      <path d="M70 80h30" stroke="#8f84e3" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M68.5 90.5l2 2 3.6-4" stroke="#4fa08f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="71" cy="99" r="2.3" fill="#c9c2f5" />
      <circle cx="71" cy="108" r="2.3" fill="#c9c2f5" />
      <path d="M78 90h26M78 99h22M78 108h14" stroke="#d9d4f2" strokeWidth="2.6" strokeLinecap="round" />
      <path d={SPARK} transform="translate(98 71) scale(.42)" fill="#f7c948" />
      <g transform="rotate(-5 88 66)">
        <rect x="76" y="60" width="26" height="9" fill="#cfc9f7" opacity=".9" />
        <path d="M76 64.5h26" stroke="#fff" strokeOpacity=".6" strokeWidth="2" strokeDasharray="3 3" />
      </g>
    </g>

    {/* ekor: jahe dengan ujung putih */}
    <path d="M190 112C212 104 232 92 230 68c-1-14-14-16-18-6" stroke={GINGER_DK} strokeWidth="15" strokeLinecap="round" fill="none" />
    <path d="M190 112C212 104 232 92 230 68c-1-14-14-16-18-6" stroke={GINGER} strokeWidth="11" strokeLinecap="round" fill="none" />
    <path d="M214 90c5 1 9-1 12-4M222 78c4 1 7 0 10-2" stroke={GINGER_DK} strokeWidth="2.6" strokeLinecap="round" fill="none" />
    <path d="M216 60c-2 1-3 3-4 4" stroke="#fffefb" strokeWidth="11" strokeLinecap="round" fill="none" />

    {/* badan */}
    <ellipse cx="156" cy="106" rx="31" ry="27" fill="url(#cbFur)" stroke={FUR} strokeWidth="1.6" />
    <g clipPath="url(#cbBody)">
      <ellipse cx="136" cy="96" rx="17" ry="22" fill={GINGER} />
      <path d="M126 100h9M128 108h9M126 116h8" stroke={GINGER_DK} strokeWidth="2.4" strokeLinecap="round" />
    </g>

    {/* kepala (miring sedikit) */}
    <g transform="translate(156 62) rotate(-5)">
      {/* rumbai pipi */}
      <path d="M-33 9L-42 11-34 15zM-32 17L-40 21-31 22z" fill="url(#cbFur)" stroke={FUR} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M33 9L42 11 34 15zM32 17L40 21 31 22z" fill="url(#cbFur)" stroke={FUR} strokeWidth="1.3" strokeLinejoin="round" />
      {/* telinga */}
      <path d="M-31-6Q-36-37-22-42Q-8-36-3-23z" fill={GINGER} stroke={GINGER_DK} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M31-6Q36-37 22-42Q8-36 3-23z" fill="url(#cbFur)" stroke={FUR} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M-27-11Q-30-32-22-35Q-13-31-9-22z" fill="#f8a9bd" />
      <path d="M27-11Q30-32 22-35Q13-31 9-22z" fill="#f8a9bd" />
      {/* kepala */}
      <path d="M-34 6C-36-14-20-27 0-27S36-14 34 6C34 22 18 31 0 31S-34 22-34 6Z" fill="url(#cbFur)" stroke={FUR} strokeWidth="1.6" />
      <g clipPath="url(#cbHead)">
        <ellipse cx="-22" cy="-18" rx="23" ry="19" fill={GINGER} />
        <ellipse cx="29" cy="15" rx="10" ry="9" fill={GINGER} />
        <path d="M-15-20v6M-10-22v8M-5-21v6" stroke={GINGER_DK} strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <ellipse cx="0" cy="16" rx="12" ry="8.5" fill="#fffefb" />
      {/* mata besar berkilau */}
      <ellipse cx="-14" cy="4" rx="5.2" ry="6.6" fill="#2b2550" />
      <ellipse cx="14" cy="4" rx="5.2" ry="6.6" fill="#2b2550" />
      <ellipse cx="-14" cy="7.5" rx="3.4" ry="2.6" fill="#5b52b8" opacity=".85" />
      <ellipse cx="14" cy="7.5" rx="3.4" ry="2.6" fill="#5b52b8" opacity=".85" />
      <circle cx="-15.6" cy="1.4" r="2.4" fill="#fff" />
      <circle cx="-11.6" cy="6.4" r="1.1" fill="#fff" />
      <circle cx="12.4" cy="1.4" r="2.4" fill="#fff" />
      <circle cx="16.4" cy="6.4" r="1.1" fill="#fff" />
      {/* pipi, hidung, mulut */}
      <ellipse cx="-25" cy="14" rx="6.5" ry="3.8" fill="#ff9db7" opacity=".6" />
      <ellipse cx="25" cy="14" rx="6.5" ry="3.8" fill="#ff9db7" opacity=".6" />
      <path d="M-3 12.2q3-1.6 6 0-1.5 3.4-3 3.6-1.5-.2-3-3.6z" fill="#f2768f" />
      <path d="M0 15.8V17.5M-6 17.5q3 4 6 0 3 4 6 0" stroke="#2b2550" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M-27 10q-9-2-15-1M-27 14q-10 1-15 4M27 10q9-2 15-1M27 14q10 1 15 4" stroke={FUR} strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </g>

    {/* kalung + lonceng */}
    <path d="M133 88Q156 108 179 88" stroke="#ff7fa5" strokeWidth="6" strokeLinecap="round" fill="none" />
    <circle cx="156" cy="103" r="5.5" fill="#ffd45e" stroke="#f0a63a" strokeWidth="1.5" />
    <path d="M152.5 103h7" stroke="#f0a63a" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="156" cy="105.5" r="1" fill="#c9821c" />

    {/* sisi depan kotak */}
    <polygon points="22,104 112,128 112,200 22,174" fill="url(#cbFaceL)" />
    <polygon points="112,128 204,98 204,168 112,200" fill="url(#cbFaceR)" />
    <polygon points="22,104 112,128 106,140 14,116" fill="url(#cbFlap)" />
    <polygon points="112,128 204,98 210,110 118,140" fill="#8a7fe0" />
    <path d="M22 104L112 128 204 98" stroke="#fff" strokeOpacity=".3" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    <polygon points="100,130 124,136 124,200 100,194" fill="#e3e0fb" opacity=".4" />

    {/* tulisan */}
    <g transform="translate(30 146) rotate(16)" fill="#fff" fontSize="27" fontWeight="700" stroke="#4a40a3" strokeWidth="1.8" paintOrder="stroke" strokeLinejoin="round">
      <text>Creative</text>
      <text x="20" y="24">Box</text>
    </g>
    <path d="M168 148l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" fill="#ffd45e" transform="translate(6 -4)" />
    <path d={SPARK} transform="translate(178 172) scale(.4)" fill="#fff" opacity=".7" />

    {/* kaki depan kucing di tepi kotak */}
    <g transform="rotate(-18 138 121)">
      <ellipse cx="138" cy="121" rx="10" ry="7" fill="url(#cbFur)" stroke={FUR} strokeWidth="1.5" />
      <path d="M134.5 119.5v3.5M138 119v4M141.5 119.5v3.5" stroke={FUR} strokeWidth="1.2" strokeLinecap="round" />
    </g>
    <g transform="rotate(-18 172 110)">
      <ellipse cx="172" cy="110" rx="10" ry="7" fill="url(#cbFur)" stroke={FUR} strokeWidth="1.5" />
      <path d="M168.5 108.5v3.5M172 108v4M175.5 108.5v3.5" stroke={FUR} strokeWidth="1.2" strokeLinecap="round" />
    </g>

    {/* tanaman kecil */}
    <g transform="translate(-40 118) scale(.58)">
      <LeavesShape />
    </g>
    <g transform="translate(244 150) scale(-.42 .42)">
      <LeavesShape />
    </g>
  </svg>
);

/* ---------- Ilustrasi "Terima Kasih": bohlam tersenyum di atas awan ---------- */
const OSTAR = 'M12 2.5l2.9 6.1 6.7.8-4.9 4.6 1.3 6.6L12 17.3l-6 3.3 1.3-6.6L2.4 9.4l6.7-.8z';

export const ThanksIllustration = ({ className = '' }: P) => (
  <svg viewBox="0 0 320 214" className={className} role="img" aria-label="Lampu ide tersenyum di atas awan">
    <defs>
      <linearGradient id="tkCloudA" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#dcd9ff" />
        <stop offset="1" stopColor="#ecebff" />
      </linearGradient>
      <linearGradient id="tkCloudB" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f4f3ff" />
        <stop offset="1" stopColor="#e4e2ff" />
      </linearGradient>
      <radialGradient id="tkGlow">
        <stop offset="0" stopColor="#fff6c4" stopOpacity=".95" />
        <stop offset=".6" stopColor="#ffe9a0" stopOpacity=".35" />
        <stop offset="1" stopColor="#ffe9a0" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* awan berlapis */}
    <g fill="url(#tkCloudA)">
      <g transform="translate(-8 50) scale(1.2)"><CloudShape /></g>
      <g transform="translate(116 40)" opacity=".9"><CloudShape /></g>
    </g>
    <g fill="url(#tkCloudB)">
      <g transform="translate(36 92) scale(1.4)"><CloudShape /></g>
    </g>
    <g fill="#fbfaff" opacity=".9">
      <g transform="translate(-22 134) scale(.9)"><CloudShape /></g>
      <g transform="translate(160 152) scale(.8)"><CloudShape /></g>
    </g>

    {/* halo di belakang bohlam */}
    <circle cx="160" cy="92" r="52" fill="#f1efff" opacity=".75" />
    <circle cx="160" cy="84" r="66" fill="url(#tkGlow)" />

    {/* bohlam tersenyum */}
    <g transform="rotate(-6 160 84)">
      <g transform="translate(102 24) scale(1.15)">
        <BulbShape />
        <ellipse cx="42" cy="34" rx="2.8" ry="3.8" fill="#3b3470" />
        <ellipse cx="58" cy="34" rx="2.8" ry="3.8" fill="#3b3470" />
        <circle cx="41" cy="32.5" r="1" fill="#fff" />
        <circle cx="57" cy="32.5" r="1" fill="#fff" />
        <ellipse cx="35" cy="44" rx="4.2" ry="2.5" fill="#ff9db7" opacity=".65" />
        <ellipse cx="65" cy="44" rx="4.2" ry="2.5" fill="#ff9db7" opacity=".65" />
        <path d="M45 42q5 6.5 10 0" stroke="#3b3470" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </g>
    </g>

    {/* pesawat kertas */}
    <svg x="212" y="12" width="78" height="43" viewBox="0 0 90 50" fill="none">
      <PlaneShape />
    </svg>

    {/* sparkle & bintang outline */}
    <g fill="none" stroke="#f0b53a" strokeWidth="1.6" strokeLinejoin="round">
      <path d={SPARK} transform="translate(40 36) scale(.8)" />
      <path d={OSTAR} transform="translate(264 92) scale(.9)" />
      <path d={OSTAR} transform="translate(10 150) scale(.8)" />
    </g>
    <path d={SPARK} transform="translate(30 92) scale(.5)" fill="#ffd45e" />
    <path d={SPARK} transform="translate(286 150) scale(.45)" fill="#ffd45e" />
    <path d={SPARK} transform="translate(80 12) scale(.4)" fill="#c4bdf5" />
    <g stroke="#c4bdf5" strokeWidth="1.6" strokeLinecap="round">
      <path d="M296 56v8M292 60h8" />
      <path d="M18 118v7M14.5 121.5h7" />
    </g>
    <circle cx="276" cy="196" r="3" fill="none" stroke="#c4bdf5" strokeWidth="1.6" />
    <circle cx="52" cy="190" r="2" fill="#f9a8c0" />
  </svg>
);

/* ---------- Latar halaman sukses: grid kertas, blob cat air, bintang, catatan ---------- */
const OUTLINE: { c: string; s: string; k: 'st' | 'sp' | 'pl'; d: string }[] = [
  { c: 'left-[8%] top-[12%]', s: 'h-5 w-5 text-amber-400', k: 'st', d: '0s' },
  { c: 'left-[20%] top-[26%]', s: 'h-4 w-4 text-amber-400', k: 'sp', d: '.8s' },
  { c: 'right-[12%] top-[22%]', s: 'h-6 w-6 text-amber-400', k: 'st', d: '1.4s' },
  { c: 'left-[4%] top-[42%]', s: 'h-4 w-4 text-violet-300', k: 'sp', d: '.4s' },
  { c: 'right-[5%] top-[40%]', s: 'h-4 w-4 text-violet-300', k: 'pl', d: '1s' },
  { c: 'left-[12%] top-[58%]', s: 'h-5 w-5 text-amber-300', k: 'st', d: '1.8s' },
  { c: 'right-[18%] top-[56%]', s: 'h-4 w-4 text-violet-300', k: 'sp', d: '.2s' },
  { c: 'left-[34%] top-[8%]', s: 'h-3.5 w-3.5 text-violet-300', k: 'pl', d: '1.2s' },
  { c: 'right-[32%] top-[70%]', s: 'h-4 w-4 text-amber-300', k: 'sp', d: '.6s' },
  { c: 'left-[40%] bottom-[8%]', s: 'h-4 w-4 text-violet-300', k: 'st', d: '1.6s' },
];

export const ThanksBackdrop = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* kertas berkotak */}
    <div
      className="absolute inset-0 opacity-50"
      style={{
        backgroundImage:
          'linear-gradient(#e6e3fb 1px, transparent 1px), linear-gradient(90deg, #e6e3fb 1px, transparent 1px)',
        backgroundSize: '26px 26px',
        WebkitMaskImage: 'radial-gradient(75% 65% at 50% 40%, #000 25%, transparent 100%)',
        maskImage: 'radial-gradient(75% 65% at 50% 40%, #000 25%, transparent 100%)',
      }}
    />

    {/* blob cat air */}
    <svg viewBox="0 0 400 400" className="absolute -right-28 -top-24 w-[340px] sm:w-[480px]">
      <defs>
        <linearGradient id="tkBlobA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9d6ff" />
          <stop offset="1" stopColor="#c9d8ff" />
        </linearGradient>
      </defs>
      <path d="M310 30c58 22 96 92 74 160-22 66-96 112-164 98C150 274 92 224 104 156 118 80 236 0 310 30z" fill="url(#tkBlobA)" opacity=".7" />
    </svg>
    <svg viewBox="0 0 400 400" className="absolute -bottom-28 -left-24 w-[320px] sm:w-[440px]">
      <path d="M90 120c70-40 170-20 220 50s30 160-40 190S90 380 50 300 10 160 90 120z" fill="#d8e4ff" opacity=".6" />
    </svg>
    <svg viewBox="0 0 400 400" className="absolute -bottom-32 -right-24 w-[300px] sm:w-[420px]">
      <path d="M250 90c70 10 130 70 120 150s-80 140-160 130S60 290 90 210 190 80 250 90z" fill="#e1dcff" opacity=".7" />
    </svg>

    {/* bintang putih bercahaya di pojok */}
    <svg viewBox="0 0 24 24" className="absolute right-6 top-6 h-9 w-9 drop-shadow-[0_0_10px_rgba(255,255,255,0.95)]">
      <path d={OSTAR} fill="#fff" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>

    {/* bintang, sparkle, plus (outline) */}
    {OUTLINE.map((x, i) => (
      <svg
        key={i}
        viewBox="0 0 24 24"
        className={`absolute ${x.c} ${x.s} animate-twinkle`}
        style={{ animationDelay: x.d }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {x.k === 'st' && <path d={OSTAR} />}
        {x.k === 'sp' && <path d={SPARK} />}
        {x.k === 'pl' && <path d="M12 4v16M4 12h16" />}
      </svg>
    ))}

    {/* catatan tulisan tangan di pojok kanan bawah */}
    <div className="absolute bottom-6 right-5 flex flex-col items-end sm:bottom-10 sm:right-10">
      <Note className="-rotate-6 text-right !text-[22px] !leading-[1.05] sm:!text-2xl">
        Ide kamu,
        <br />
        untuk masa depan
        <br />
        yang lebih baik!
      </Note>
      <div className="mt-1 flex items-center gap-1.5 text-indigo-500">
        <Arrow className="h-5 w-12" />
        <Smiley className="h-6 w-6" />
      </div>
    </div>
  </div>
);

/* ---------- Latar halaman: gradasi, titik kertas, sparkle ---------- */
const SCATTER: { c: string; s: string; k: 'sp' | 'st' | 'ht' | 'ci'; d: string; hide?: boolean }[] = [
  { c: 'top-[4%] left-[6%]', s: 'h-4 w-4 text-violet-300', k: 'sp', d: '0s' },
  { c: 'top-[9%] right-[8%]', s: 'h-5 w-5 text-amber-300', k: 'st', d: '.8s' },
  { c: 'top-[28%] left-[3%]', s: 'h-3 w-3 text-indigo-300', k: 'sp', d: '1.4s', hide: true },
  { c: 'top-[38%] right-[4%]', s: 'h-4 w-4 text-violet-300', k: 'sp', d: '.4s' },
  { c: 'top-[58%] left-[5%]', s: 'h-5 w-5 text-amber-300', k: 'st', d: '1.1s', hide: true },
  { c: 'top-[72%] right-[7%]', s: 'h-3 w-3 text-pink-300', k: 'sp', d: '1.8s' },
  { c: 'top-[88%] left-[40%]', s: 'h-4 w-4 text-violet-300', k: 'sp', d: '.6s' },
  { c: 'top-[18%] right-[16%]', s: 'h-5 w-5 text-pink-300', k: 'ht', d: '.9s', hide: true },
  { c: 'top-[64%] left-[12%]', s: 'h-4 w-4 text-pink-200', k: 'ht', d: '1.6s', hide: true },
  { c: 'top-[48%] left-[2%]', s: 'h-3 w-3 border-2 border-violet-200 rounded-full', k: 'ci', d: '0s' },
  { c: 'top-[80%] right-[14%]', s: 'h-4 w-4 border-2 border-indigo-200 rounded-full', k: 'ci', d: '0s', hide: true },
  { c: 'top-[6%] left-[34%]', s: 'h-3 w-3 border-2 border-amber-200 rounded-full', k: 'ci', d: '0s', hide: true },
];

export const PageBackground = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(60% 35% at 8% 0%, #e2e0ff 0, transparent 70%), radial-gradient(50% 30% at 100% 28%, #ffeaf2 0, transparent 70%), radial-gradient(60% 35% at 0% 100%, #dff2ea 0, transparent 70%), radial-gradient(50% 30% at 100% 100%, #ece9ff 0, transparent 70%), #f5f4ff',
      }}
    />
    <div
      className="absolute inset-0 opacity-40"
      style={{ backgroundImage: 'radial-gradient(#c9c5ee 1px, transparent 1px)', backgroundSize: '22px 22px' }}
    />
    <ThinCloud className="animate-drift absolute left-[3%] top-[12%] w-44 text-white/80 sm:w-64" />
    <ThinCloud
      className="animate-drift absolute right-[2%] top-[44%] w-36 text-indigo-100/70 sm:w-56"
      style={{ animationDelay: '-7s' }}
    />
    <ThinCloud
      className="animate-drift absolute bottom-[10%] left-[8%] hidden w-52 text-white/70 sm:block"
      style={{ animationDelay: '-12s' }}
    />
    {SCATTER.map((x, i) => (
      <span key={i} className={`absolute ${x.c} ${x.hide ? 'hidden sm:block' : ''}`}>
        {x.k === 'sp' && <Sparkle className={`${x.s} animate-twinkle`} />}
        {x.k === 'st' && <Star className={`${x.s} animate-twinkle`} />}
        {x.k === 'ht' && <Heart className={`${x.s} animate-twinkle`} />}
        {x.k === 'ci' && <span className={`block ${x.s}`} />}
      </span>
    ))}
    <Leaves className="absolute -bottom-3 -left-4 h-40 w-28 -rotate-6 opacity-90 sm:h-52 sm:w-36" />
    <Leaves className="absolute -bottom-3 -right-4 h-36 w-24 rotate-6 scale-x-[-1] opacity-90 sm:h-48 sm:w-32" />
  </div>
);