import { cn } from '@/lib/utils';

interface CheckboardProps {
  className?: string;
}

export default function Checkboard({ className }: CheckboardProps) {
  return (
    <div
      className={cn(
        'pattern-rectangles pattern-violet-500 pattern-bg-white pattern-size-3 pattern-opacity-40',
        className
      )}
    />
  );
}
