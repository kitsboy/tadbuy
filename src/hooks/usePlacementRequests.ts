import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { authFetch } from '@/lib/authFetch';
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
import type { DurablePlacementRequestRecord } from '@/lib/db/types';

function fromDurableRequest(value: DurablePlacementRequestRecord): PlacementRequest {
  return {
    id: value.id,
    slotId: value.inventoryId,
    slotName: value.slotName,
    publisher: value.publisher,
    channel: value.channel,
    format: value.format,
    audience: value.audience,
    budgetSats: value.budgetSats,
    advertiserLabel: value.advertiserLabel,
    message: value.message,
    disclosureRequired: true,
    proofRequirements: value.proofRequirements,
    status: value.status,
    createdAt: value.createdAt,
    ...(value.acceptedAt ? { acceptedAt: value.acceptedAt } : {}),
    ...(value.publishedAt ? { publishedAt: value.publishedAt } : {}),
    ...(value.proof ? { proof: value.proof } : {}),
    durable: true,
    vendorId: value.vendorId,
    inventoryId: value.inventoryId,
  };
}

export function usePlacementRequests() {
  const { user } = useAuth();
  const [localRequests, setLocalRequests] = useLocalStorage<PlacementRequest[]>(PLACEMENT_REQUESTS_KEY, []);
  const [remoteRequests, setRemoteRequests] = useState<PlacementRequest[] | null>(null);
  const [durableLoading, setDurableLoading] = useState(Boolean(user));

  useEffect(() => {
    if (!user) {
      setRemoteRequests(null);
      setDurableLoading(false);
      return;
    }

    let cancelled = false;
    setDurableLoading(true);
    authFetch('/api/placement-requests')
      .then(async response => {
        if (!response.ok) return null;
        const body = await response.json() as { requests?: DurablePlacementRequestRecord[]; durable?: boolean };
        if (body.durable !== true || !Array.isArray(body.requests)) return null;
        return body.requests.map(fromDurableRequest);
      })
      .then(result => {
        if (!cancelled && result) setRemoteRequests(result);
      })
      .catch(() => {
        // The local pilot remains available when the durable API is unavailable.
      })
      .finally(() => {
        if (!cancelled) setDurableLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const requests = remoteRequests ?? localRequests;

  const requestPlacement = useCallback(async (input: {
    slot: MarketplaceSlot;
    advertiserLabel: string;
    budgetSats: number;
    message: string;
  }): Promise<PlacementRequest> => {
    if (input.slot.durable) {
      if (!user) throw new Error('Sign in to request durable vendor inventory.');
      const response = await authFetch('/api/placement-requests', {
        method: 'POST',
        body: JSON.stringify({
          inventoryId: input.slot.inventoryId ?? input.slot.id,
          vendorId: input.slot.vendorId,
          advertiserLabel: input.advertiserLabel,
          budgetSats: input.budgetSats,
          message: input.message,
        }),
      });
      const body = await response.json().catch(() => ({})) as { request?: DurablePlacementRequestRecord; error?: string };
      if (!response.ok || !body.request) throw new Error(body.error ?? 'Durable placement request failed.');
      const request = fromDurableRequest(body.request);
      setRemoteRequests(current => [...(current ?? []), request]);
      return request;
    }

    const request = createPlacementRequest(input);
    setLocalRequests([...localRequests, request]);
    return request;
  }, [localRequests, setLocalRequests, user]);

  const transitionPlacement = useCallback(async (id: string, status: PlacementStatus, proof?: PlacementProof): Promise<boolean> => {
    const current = requests.find(request => request.id === id);
    if (!current) return false;

    if (current.durable) {
      if (!user) return false;
      const response = await authFetch(`/api/placement-requests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, ...(proof ? { proof } : {}) }),
      });
      const body = await response.json().catch(() => ({})) as { request?: DurablePlacementRequestRecord };
      if (!response.ok || !body.request) return false;
      const updated = fromDurableRequest(body.request);
      setRemoteRequests(currentRequests => (currentRequests ?? []).map(request => request.id === id ? updated : request));
      return true;
    }

    if (!canAdvancePlacement(current, status)) return false;
    setLocalRequests(localRequests.map(request =>
      request.id === id ? nextPlacementStatus(request, status, proof) : request
    ));
    return true;
  }, [localRequests, requests, setLocalRequests, user]);

  return {
    requests,
    requestPlacement,
    transitionPlacement,
    durable: remoteRequests !== null,
    durableLoading,
  };
}
