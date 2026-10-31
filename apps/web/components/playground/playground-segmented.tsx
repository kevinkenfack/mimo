'use client';

interface SegmentOption<Value extends string | number> {
  value: Value;
  label: string;
}

interface PlaygroundSegmentedProps<Value extends string | number> {
  label?: string;
  value: Value;
  options: readonly SegmentOption<Value>[];
  onChange: (value: Value) => void;
  columns?: number;
  className?: string;
}

export function PlaygroundSegmented<Value extends string | number>({
  label,
  value,
  options,
  onChange,
  columns,
  className = '',
}: PlaygroundSegmentedProps<Value>) {
  const gridStyle = columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <span className='block text-xs font-medium text-foreground-secondary'>{label}</span>}
      <div
        style={gridStyle}
        className={`grid gap-1 rounded-xl border border-border/80 bg-surface p-1 ${
          !columns ? 'grid-flow-col auto-cols-fr' : ''
        }`}
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={String(option.value)}
              type='button'
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={`min-h-8 truncate rounded-lg px-2.5 py-1 text-center text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                isSelected
                  ? 'bg-surface-raised text-heading shadow-xs'
                  : 'text-foreground-secondary hover:bg-surface-raised/60 hover:text-heading'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
