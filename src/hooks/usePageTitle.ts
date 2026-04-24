import { useEffect } from 'react';

const BASE_TITLE = 'Tadbuy';

export function usePageTitle(pageTitle: string) {
  useEffect(() => {
    document.title = `${pageTitle} | ${BASE_TITLE}`;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [pageTitle]);
}
