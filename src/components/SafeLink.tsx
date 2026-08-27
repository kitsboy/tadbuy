/**
 * Safe external link component — drop-in <a> that enforces
 * rel="noopener noreferrer", validates the URL scheme, and adds
 * a visible "external" indicator. Use this instead of bare <a target="_blank">.
 */

import { AnchorHTMLAttributes, forwardRef } from 'react';
import { ExternalLink, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { safeExternalProps, isSafeUrl } from '@/lib/security/safeLink';

interface SafeLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'> {
  href: string;
  showIcon?: boolean;
  rel?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  className?: string;
  children?: React.ReactNode;
}

export const SafeLink = forwardRef<HTMLAnchorElement, SafeLinkProps>(
  function SafeLink({ href, showIcon = false, rel, target, className, children, ...rest }, ref) {
    const props = safeExternalProps(href, { rel, target });
    const isUnsafe = !isSafeUrl(href);

    if (isUnsafe) {
      return (
        <span
          className={cn('inline-flex items-center gap-1 text-zinc-500 line-through', className)}
          title="Blocked unsafe URL"
        >
          <Lock className="h-3 w-3" />
          {children ?? href}
        </span>
      );
    }

    return (
      <a ref={ref} {...props} {...rest} className={cn('inline-flex items-center gap-1', className)}>
        {children}
        {showIcon && <ExternalLink className="h-3 w-3 opacity-60" aria-hidden />}
      </a>
    );
  }
);
