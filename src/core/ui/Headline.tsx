import { cn } from './cn';

/** `<Hl>`-Prinzip: Akzentwörter in Rot (hell) oder Lime (dunkel). Rot auf Navy ist nicht lesbar. */
export function Hl({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  return <span className={tone === 'dark' ? 'text-lime' : 'text-red'}>{children}</span>;
}

export function Headline({
  parts, size = 'h1', tone = 'light', className, as: Tag = 'h1',
}: {
  parts: readonly [string, string, string];
  size?: 'display-xl' | 'h1' | 'h2';
  tone?: 'light' | 'dark';
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <Tag className={cn(size, 'm-0 font-normal', tone === 'dark' ? 'text-white' : 'text-navy', className)}>
      {parts[0]}
      <Hl tone={tone}>{parts[1]}</Hl>
      {parts[2]}
    </Tag>
  );
}
