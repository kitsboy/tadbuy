const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

function polymod(values: number[]): number {
  const generator = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let checksum = 1;
  for (const value of values) {
    const top = checksum >>> 25;
    checksum = ((checksum & 0x1ffffff) << 5) ^ value;
    for (let index = 0; index < 5; index++) {
      if ((top >>> index) & 1) checksum ^= generator[index];
    }
  }
  return checksum >>> 0;
}

function convertBits(data: number[], fromBits: number, toBits: number): number[] | null {
  let accumulator = 0;
  let bits = 0;
  const output: number[] = [];
  const maxValue = (1 << toBits) - 1;
  const maxAccumulator = (1 << (fromBits + toBits - 1)) - 1;

  for (const value of data) {
    if (value < 0 || (value >>> fromBits) !== 0) return null;
    accumulator = ((accumulator << fromBits) | value) & maxAccumulator;
    bits += fromBits;
    while (bits >= toBits) {
      bits -= toBits;
      output.push((accumulator >>> bits) & maxValue);
    }
  }

  if (bits >= fromBits || ((accumulator << (toBits - bits)) & maxValue) !== 0) return null;
  return output;
}

/** Decode a NIP-19 npub into its 32-byte lowercase hex pubkey. */
export function decodeNpub(value: string): string | null {
  const input = value.trim().toLowerCase();
  if (!input.startsWith('npub1') || input !== value.trim()) return null;
  const separator = input.lastIndexOf('1');
  if (separator < 1 || separator + 7 > input.length) return null;
  const words = input.slice(separator + 1).split('').map(char => CHARSET.indexOf(char));
  if (words.some(word => word < 0) || polymod(words) !== 1) return null;
  const payload = convertBits(words.slice(0, -6), 5, 8);
  if (!payload || payload.length !== 32) return null;
  return payload.map(byte => byte.toString(16).padStart(2, '0')).join('');
}
