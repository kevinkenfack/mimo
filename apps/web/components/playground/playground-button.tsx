import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

export type PlaygroundButtonVariant = 'primary' | 'secondary' | 'ghost';

const BUTTON_BASE =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-50';

const BUTTON_VARIANTS: Record<PlaygroundButtonVariant, string> = {
  primary: 'bg-foreground text-background hover:opacity-85',
  secondary: 'border border-border-strong bg-surface-raised text-heading hover:bg-surface',
  ghost: 'text-foreground-secondary hover:bg-surface',
};

export function playgroundButtonClassName(variant: PlaygroundButtonVariant = 'secondary', className = '') {
  return `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`.trim();
}

type PlaygroundButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: PlaygroundButtonVariant;
};

export function PlaygroundButton({
  variant = 'secondary',
  className,
  type = 'button',
  ...props
}: PlaygroundButtonProps) {
  return <button {...props} type={type} className={playgroundButtonClassName(variant, className)} />;
}

type PlaygroundLinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: PlaygroundButtonVariant;
};

export function PlaygroundLinkButton({
  variant = 'secondary',
  className,
  ...props
}: PlaygroundLinkButtonProps) {
  return <a {...props} className={playgroundButtonClassName(variant, className)} />;
}
