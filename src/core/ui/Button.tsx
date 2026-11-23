import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'secondary' | 'link' | 'lime';
type Tone = 'light' | 'dark';

interface Common {
  variant?: Variant;
  tone?: Tone; // Hintergrund, auf dem der Button steht
  icon?: ReactNode;
  full?: boolean;
  small?: boolean;
  children: ReactNode;
  className?: string;
}

function classes({ variant = 'primary', tone = 'light', full = true, small = false, className }: Common) {
  const base = `inline-flex select-none items-center justify-center gap-2 font-semibold ${small ? 'text-[14px] leading-5' : 'text-[17px] leading-6'} transition-transform duration-[120ms] active:scale-[.98] disabled:opacity-40 disabled:pointer-events-none`;
  const pill = small ? 'min-h-14 rounded-full px-3' : 'min-h-14 rounded-full px-6';
  const v: Record<Variant, string> = {
    primary: `${pill} bg-red-grad text-white shadow-light ${tone === 'dark' ? 'ring-1 ring-white/25' : ''}`,
    lime: `${pill} bg-lime-grad text-navy shadow-dark`,
    secondary: `${pill} border-2 bg-transparent ${tone === 'dark' ? 'border-white text-white' : 'border-navy text-navy'}`,
    link: `min-h-12 whitespace-nowrap px-2 underline underline-offset-4 ${tone === 'dark' ? 'text-white' : 'text-red'}`,
  };
  return cn(base, v[variant], full && variant !== 'link' && 'w-full', className);
}

export function Button(p: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { variant, tone, icon, full, small, className, children, ...rest } = p;
  return (
    <button type="button" className={classes({ variant, tone, full, small, className, children })} {...rest}>
      {icon}
      {children}
    </button>
  );
}

export function LinkButton(p: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { variant, tone, icon, full, small, className, children, ...rest } = p;
  return (
    <a className={classes({ variant, tone, full, small, className, children })} {...rest}>
      {icon}
      {children}
    </a>
  );
}

export function IconButton({ label, children, tone = 'light', className, ...rest }: { label: string; children: ReactNode; tone?: Tone; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn('inline-flex h-12 w-12 items-center justify-center rounded-full transition-transform active:scale-95', tone === 'dark' ? 'text-white' : 'text-navy', className)}
      {...rest}
    >
      {children}
    </button>
  );
}
