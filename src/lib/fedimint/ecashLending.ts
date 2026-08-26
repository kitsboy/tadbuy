/**
 * Ecash-Backed Lending Protocol — Lend/borrow ecash within federations
 * 
 * Federation members can lend and borrow ecash tokens using minor signatures
 * as collateral. Interest rates are set by the federation governance.
 */

export interface LoanOffer {
  offerId: string;
  lenderPubkey: string;
  borrowerPubkey?: string;
  principalSats: number;
  interestRateBps: number; // basis points
  termDays: number;
  collateralRequired: boolean;
  collateralRatio: number; // e.g., 1.5 = 150% collateral
  status: 'open' | 'matched' | 'active' | 'repaid' | 'defaulted';
  createdAt: number;
  expiresAt: number;
}

export interface Loan {
  offerId: string;
  lender: string;
  borrower: string;
  principalSats: number;
  interestSats: number;
  totalDueSats: number;
  dueDate: number;
  repaidAt?: number;
  status: 'active' | 'overdue' | 'repaid' | 'defaulted';
}

/** Calculate total repayment amount */
export function calculateRepayment(principal: number, rateBps: number): Loan {
  const interestSats = Math.floor(principal * rateBps / 10000);
  return {
    offerId: '',
    lender: '',
    borrower: '',
    principalSats: principal,
    interestSats,
    totalDueSats: principal + interestSats,
    dueDate: Date.now() + 30 * 86400000,
    status: 'active',
  };
}

/** Create a loan offer */
export function createLoanOffer(
  lenderPubkey: string,
  principalSats: number,
  interestRateBps: number,
  termDays: number,
  collateralRequired: boolean = true,
  collateralRatio: number = 1.5
): LoanOffer {
  return {
    offerId: `loan_${Date.now()}`,
    lenderPubkey,
    principalSats,
    interestRateBps,
    termDays,
    collateralRequired,
    collateralRatio,
    status: 'open',
    createdAt: Date.now(),
    expiresAt: Date.now() + 86400000 * 7,
  };
}

/** Mock loan marketplace */
export const MOCK_LOAN_OFFERS: LoanOffer[] = [
  createLoanOffer('npub1lender1...', 1_000_000, 500, 30, true, 1.5),
  createLoanOffer('npub1lender2...', 5_000_000, 300, 90, true, 1.25),
];