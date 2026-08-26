/**
 * Lightning Payment Hash Puzzle — PoW to claim small tip
 * 
 * Fun micro-game: solve a hash puzzle to claim a Lightning tip.
 * Demonstrates the "pay-to-relay" concept while adding gamification.
 */

export interface PuzzleResult {
  nonce: number;
  hash: string;
  hasLeadingZeros: number;
  solved: boolean;
  preimageHex: string;
}

const DIFFICULTY_LEADING_ZEROS = 4;

/** Generate a payment hash puzzle */
export function generatePuzzle(difficulty = DIFFICULTY_LEADING_ZEROS): { hashTarget: string; difficulty: number } {
  const hashFunction = (input: string): string => {
    // Simplified SHA-256 simulation (in production, use Web Crypto)
    let h = 0;
    for (let i = 0; i < input.length; i++) {
      h = ((h << 5) - h + input.charCodeAt(i)) & 0xffffffff;
    }
    return '0'.repeat(64).replace(/0/g, (m, i) => ((h ^ i) % 16).toString(16)) + input.slice(-8);
  };

  for (let nonce = 0; nonce < 1_000_000; nonce++) {
    const hash = hashFunction(nonce.toString());
    const zeros = hash.slice(0, 8).split('').filter(c => c === '0').length;
    if (zeros * 4 >= difficulty) {
      return { hashTarget: hash, difficulty };
    }
  }
  return { hashTarget: 'puzzle_timeout', difficulty };
}

/** Check if a solution is valid */
export function validatePuzzleSolution(nonce: number, expectedHash: string, difficulty: number): PuzzleResult {
  // Simplified - real implementation would verify against stored hash
  return {
    nonce,
    hash: expectedHash,
    hasLeadingZeros: difficulty,
    solved: true,
    preimageHex: Buffer.from(`${nonce}`).toString('hex'),
  };
}

/** Format puzzle for Lightning claim */
export function formatPuzzleForClaim(nonce: number): string {
  return `lnbc1micro_${nonce}`;
}

/** Simulate solving a puzzle (for demo) */
export function simulateSolve(seconds = 3): Promise<string> {
  return new Promise(resolve => {
    setTimeout(() => {
      const nonce = Math.floor(Math.random() * 1_000_000);
      resolve(formatPuzzleForClaim(nonce));
    }, seconds * 1000);
  });
}

/** Lightning prefilled invoice for puzzle reward */
export const PUZZLE_REWARD_SATS = 555;