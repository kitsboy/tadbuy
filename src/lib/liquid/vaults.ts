/**
 * Liquid Network Vaults — Multisig treasury with time-locked withdrawals
 * 
 * Secure multi-signature vault for advertiser campaign budgets with
 * configurable time-locks and withdrawal policies.
 */

export interface VaultConfig {
  vaultId: string;
  name: string;
  owners: string[]; // pubkeys
  threshold: number; // M-of-N required signatures
  timeLockBlocks: number; // blocks before withdrawal allowed
  withdrawalLimitSats: number; // per period
  periodBlocks: number;
  assetId: string; // L-BTC or other
  createdAt: number;
  status: 'active' | 'frozen' | 'closed';
}

export interface VaultWithdrawal {
  withdrawalId: string;
  vaultId: string;
  amountSats: number;
  destination: string;
  requestedBy: string;
  signatures: Array<{ signer: string; signature: string }>;
  requestedAt: number;
  executedAt?: number;
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  txid?: string;
}

/** Create a new vault */
export function createVault(
  name: string,
  owners: string[],
  threshold: number,
  timeLockBlocks: number,
  withdrawalLimitSats: number,
  periodBlocks: number,
  assetId: string
): VaultConfig {
  return {
    vaultId: `vault_${Date.now()}`,
    name,
    owners,
    threshold,
    timeLockBlocks,
    withdrawalLimitSats,
    periodBlocks,
    assetId,
    createdAt: Date.now(),
    status: 'active',
  };
}

/** Request withdrawal from vault */
export function requestWithdrawal(
  vault: VaultConfig,
  amountSats: number,
  destination: string,
  requestedBy: string
): VaultWithdrawal {
  return {
    withdrawalId: `wd_${Date.now()}`,
    vaultId: vault.vaultId,
    amountSats,
    destination,
    requestedBy,
    signatures: [],
    requestedAt: Date.now(),
    status: 'pending',
  };
}

/** Sign withdrawal request */
export function signWithdrawal(
  withdrawal: VaultWithdrawal,
  signer: string,
  signature: string
): VaultWithdrawal {
  const signatures = [...withdrawal.signatures, { signer, signature }];
  const status = signatures.length >= 2 ? 'approved' : 'pending'; // mock threshold
  
  return {
    ...withdrawal,
    signatures,
    status,
    ...(status === 'approved' ? { executedAt: Date.now(), txid: `tx_${Date.now()}` } : {}),
  };
}

/** Mock vaults for demo */
export const MOCK_VAULTS: VaultConfig[] = [
  createVault(
    'Campaign Treasury 2024',
    ['npub1owner1...', 'npub1owner2...', 'npub1owner3...'],
    2,
    144, // ~24 hours
    1_000_000,
    144,
    'lbtc'
  ),
];