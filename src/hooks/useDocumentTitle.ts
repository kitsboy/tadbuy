import { useEffect } from 'react';

const BASE_TITLE = 'Tadbuy';
const DEFAULT_DESCRIPTION =
  'Buy ads across 8 platforms. Pay in sats via Lightning, BOLT12, on-chain, or Nostr Zaps. The world\'s first Bitcoin-native DSP.';

interface DocumentTitleOptions {
  /** Page-specific meta description. */
  description?: string;
  /** Restore previous title on unmount (default true). */
  restoreOnUnmount?: boolean;
  /** Also update Open Graph / Twitter meta tags. */
  updateSocial?: boolean;
  /** Suffix appended to page title (default " | Tadbuy"). */
  suffix?: string;
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Enhanced document title hook — sets title, description, and optional OG/Twitter tags.
 * Supersedes usePageTitle for pages that need full head management.
 */
export function useDocumentTitle(
  pageTitle: string,
  {
    description = DEFAULT_DESCRIPTION,
    restoreOnUnmount = true,
    updateSocial = true,
    suffix = ` | ${BASE_TITLE}`,
  }: DocumentTitleOptions = {}
) {
  useEffect(() => {
    const fullTitle = pageTitle ? `${pageTitle}${suffix}` : `${BASE_TITLE} — Bitcoin-Native Ad Buying Platform`;
    document.title = fullTitle;
    setMetaTag('name', 'description', description);

    if (updateSocial) {
      setMetaTag('property', 'og:title', fullTitle);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:title', fullTitle);
      setMetaTag('name', 'twitter:description', description);
    }

    return () => {
      if (!restoreOnUnmount) return;
      document.title = `${BASE_TITLE} — Bitcoin-Native Ad Buying Platform`;
      setMetaTag('name', 'description', DEFAULT_DESCRIPTION);
    };
  }, [pageTitle, description, restoreOnUnmount, updateSocial, suffix]);
}