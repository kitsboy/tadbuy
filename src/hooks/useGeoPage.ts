import { useCallback, useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';
import { useLocalStorage } from './useLocalStorage';
import {
  GEO_MARKETS,
  GEO_REGIONS,
  getGeoTotals,
  type GeoMarket,
  type GeoRegion,
} from '@/data/geoMarkets';

export type GeoSortKey = 'impressions' | 'ctr' | 'spend' | 'trend' | 'name';
export type GeoViewMode = 'split' | 'map' | 'list';

export function useGeoPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [region, setRegion] = useLocalStorage<GeoRegion>('tadbuy_geo_region', 'all');
  const [sortKey, setSortKey] = useLocalStorage<GeoSortKey>('tadbuy_geo_sort', 'impressions');
  const [viewMode, setViewMode] = useLocalStorage<GeoViewMode>('tadbuy_geo_view', 'split');
  const [search, setSearch] = useState('');
  const [selectedCode, setSelectedCode] = useState<string | null>(searchParams.get('country'));
  const [watchlist, setWatchlist] = useLocalStorage<string[]>('tadbuy_geo_watchlist', ['SV', 'NG']);
  const [compareCodes, setCompareCodes] = useState<string[]>([]);
  const [targetingOpen, setTargetingOpen] = useState(false);
  const [minCtr, setMinCtr] = useState(0);

  const debouncedSearch = useDebounce(search, 250);

  // Static demo data — the platform has no /api/geo endpoints on the static host, so
  // this surface renders representative GEO_MARKETS and never makes a request.
  const markets = GEO_MARKETS;

  const filtered = useMemo(() => {
    let list = [...markets];
    if (region !== 'all') list = list.filter(m => m.region === region);
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(m =>
        m.country.toLowerCase().includes(q) || m.code.toLowerCase().includes(q)
      );
    }
    if (minCtr > 0) list = list.filter(m => m.ctr >= minCtr);
    list.sort((a, b) => {
      switch (sortKey) {
        case 'ctr': return b.ctr - a.ctr;
        case 'spend': return b.spendSats - a.spendSats;
        case 'trend': return b.trend - a.trend;
        case 'name': return a.country.localeCompare(b.country);
        default: return b.impressions - a.impressions;
      }
    });
    return list;
  }, [markets, region, debouncedSearch, sortKey, minCtr]);

  const totals = useMemo(() => getGeoTotals(filtered), [filtered]);
  const selected = useMemo(
    () => filtered.find(m => m.code === selectedCode) ?? markets.find(m => m.code === selectedCode) ?? null,
    [filtered, markets, selectedCode]
  );
  const compareMarkets = useMemo(
    () => compareCodes.map(c => markets.find(m => m.code === c)).filter(Boolean) as GeoMarket[],
    [compareCodes, markets]
  );
  const apiStats = useMemo(() => {
    const top = [...GEO_MARKETS].sort((a, b) => b.impressions - a.impressions)[0];
    return {
      countriesReached: GEO_MARKETS.length,
      totalImpressions: GEO_MARKETS.reduce((s, m) => s + m.impressions, 0),
      globalCtr: GEO_MARKETS.reduce((s, m) => s + m.ctr, 0) / Math.max(GEO_MARKETS.length, 1),
      topMarket: top,
    };
  }, []);

  useEffect(() => {
    if (selectedCode) {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set('country', selectedCode);
        return next;
      }, { replace: true });
    } else {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.delete('country');
        return next;
      }, { replace: true });
    }
  }, [selectedCode, setSearchParams]);

  const selectCountry = useCallback((code: string | null) => setSelectedCode(code), []);

  const toggleWatchlist = useCallback((code: string) => {
    setWatchlist(
      watchlist.includes(code) ? watchlist.filter(c => c !== code) : [...watchlist, code]
    );
  }, [watchlist, setWatchlist]);

  const toggleCompare = useCallback((code: string) => {
    setCompareCodes(prev => {
      if (prev.includes(code)) return prev.filter(c => c !== code);
      if (prev.length >= 3) return prev;
      return [...prev, code];
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setRegion('all');
    setMinCtr(0);
    setSortKey('impressions');
  }, [setRegion, setSortKey]);

  return {
    regions: GEO_REGIONS,
    region, setRegion,
    sortKey, setSortKey,
    viewMode, setViewMode,
    search, setSearch,
    minCtr, setMinCtr,
    filtered,
    totals,
    selected, selectCountry,
    watchlist, toggleWatchlist,
    compareCodes, compareMarkets, toggleCompare, setCompareCodes,
    targetingOpen, setTargetingOpen,
    loading: false,
    error: null,
    refetch: () => {},
    apiStats,
    clearFilters,
    allMarkets: markets,
  };
}