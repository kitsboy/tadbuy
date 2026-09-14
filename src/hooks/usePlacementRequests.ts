import { useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  PLACEMENT_REQUESTS_KEY,
  type PlacementProof,
  type PlacementRequest,
  type PlacementStatus,
  canAdvancePlacement,
  createPlacementRequest,
  nextPlacementStatus,
} from '@/data/placementRequests';
import type { MarketplaceSlot } from '@/data/marketplaceSlots';

export function usePlacementRequests() {
  const [requests, setRequests] = useLocalStorage<PlacementRequest[]>(PLACEMENT_REQUESTS_KEY, []);

  const requestPlacement = useCallback((input: {
    slot: MarketplaceSlot;
    advertiserLabel: string;
    budgetSats: number;
    message: string;
  }) => {
    const request = createPlacementRequest(input);
    setRequests([...requests, request]);
    return request;
  }, [requests, setRequests]);

  const transitionPlacement = useCallback((id: string, status: PlacementStatus, proof?: PlacementProof) => {
    const current = requests.find(request => request.id === id);
    if (!current || !canAdvancePlacement(current, status)) return false;
    setRequests(requests.map(request =>
      request.id === id ? nextPlacementStatus(request, status, proof) : request
    ));
    return true;
  }, [requests, setRequests]);

  return { requests, requestPlacement, transitionPlacement };
}
