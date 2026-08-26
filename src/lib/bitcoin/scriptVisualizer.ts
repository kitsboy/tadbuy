/**
 * Bitcoin Script Visualizer — Parse and display P2SH/P2WSH Scripts for escrows
 * 
 * Takes a Bitcoin scriptPubKey or witness stack and produces a human-readable
 * tree with condition logic, showing the spending paths for multisig escrows,
 * Miniscript policies, and timelocks.
 * 
 * This is useful for advertisers to verify escrow conditions.
 */

export interface ScriptNode {
  type: 'OP_PUSH' | 'OP_CHECKSIG' | 'OP_CHECKMULTISIG' | 'OP_CHECKMULTISIGVERIFY' |
        'OP_CHECKSEQUENCEVERIFY' | 'OP_CHECKSIGVERIFY' | 'OP_VERIFY' | 'OP_NOTVERIFY' |
        'OP_OR' | 'OP_AND' | 'OP_THRU' | 'OP_ELSE' | 'OP_ENDIF' | 'OP_IF' |
        'OP_0' | 'OP_1' | 'OP_1NEGATE' | 'OP_CHECKLOCKTIMEVERIFY' | 'OP_CHECKSEQUENCEVERIFY' |
        'OP_RETURN' | 'OP_DUP' | 'OP_HASH160' | 'OP_EQUAL' | 'OP_EQUALVERIFY' |
        'OP_TOUCH' | 'OP_DUP' | 'OP_SIZE' | 'OP_BOOLAND' | 'OP_BOOLOR' |
        'OP_NUMEQUAL' | 'OP_NUMEQUALVERIFY' | 'OP_NUMNOTEQUAL' | 'OP_LESSTHAN' |
        'OP_LESSTHANOREQUAL' | 'OP_GREATERTHAN' | 'OP_GREATERTHANOREQUAL' |
        'OP_MIN' | 'OP_MAX' | 'OP_WITHIN' | 'OP_MINISCRIPT' | 'OP_MINISCRIPTVERIFY' |
        'RAW';
  value?: string;
  hex?: string;
  children: ScriptNode[];
  description: string;
}

/** Parse a raw hex script into a structured tree */
export function parseScript(hexScript: string): ScriptNode {
  // Remove leading 0x or whitespace
  const cleanHex = hexScript.startsWith('0x') ? hexScript.slice(2) : hexScript.trim();
  
  // This is a simplified parser - in production you'd use a proper script parser
  if (cleanHex.length < 10) {
    return {
      type: 'RAW',
      hex: cleanHex,
      children: [],
      description: 'Unparseable script',
    };
  }

  const firstByte = parseInt(cleanHex.slice(0, 2), 16);
  
  // Detect script types
  if (cleanHex.startsWith('52') || cleanHex.startsWith('53')) {
    return parseMiniscriptOrMultisig(cleanHex);
  }
  
  if (cleanHex.startsWith('0020')) {
    return parseP2WSH(cleanHex);
  }

  return {
    type: 'RAW',
    hex: cleanHex,
    children: [],
    description: `Raw script: 0x${cleanHex.slice(0, 20)}...`,
  };
}

/** Parse P2WSH script (witness version 0) */
function parseP2WSH(hex: string): ScriptNode {
  // Strip OP_0 OP_0 for P2WSH wrapper
  // Witness program: 00 <20-byte-hash>
  const witnessProgram = hex.slice(4); // After 0020
  
  return {
    type: 'OP_HASH160',
    children: [
      {
        type: 'OP_PUSH',
        value: witnessProgram,
        hex: witnessProgram,
        children: [],
        description: 'SHA256 hash of witness script',
      },
    ],
    description: 'P2WSH (Pay-to-Witness-Script-Hash) — wraps the actual transaction witness script',
  };
}

/** Parse Miniscript or multisig */
function parseMiniscriptOrMultisig(hex: string): ScriptNode {
  // Check if it looks like a Miniscript expression
  // Miniscript typically starts with OP_IF, OP_ELSE, OP_ENDIF for complex scripts
  
  const children: ScriptNode[] = [];
  let description = 'Multisig or Miniscript';

  if (hex.includes('67')) { // OP_CHECKVERIFY
    description = 'Miniscript policy with verification';
  }
  
  return {
    type: hex.includes('6f') ? 'OP_OR' : 'OP_CHECKMULTISIG',
    hex,
    children,
    description,
  };
}

/** Parse 2-of-2 multisig for campaign escrow */
export function parseTwoOfTwoMultisig(pubkeyA: string, pubkeyB: string, timelockBlocks: number): ScriptNode {
  return {
    type: 'OP_MINISCRIPT',
    children: [
      {
        type: 'OP_IF',
        children: [
          {
            type: 'OP_CHECKMULTISIG',
            children: [
              { type: 'OP_PUSH', value: pubkeyA.slice(0, 64), hex: pubkeyA, children: [], description: 'Advertiser key' },
              { type: 'OP_PUSH', value: pubkeyB.slice(0, 64), hex: pubkeyB, children: [], description: 'Publisher key' },
            ],
            description: '2-of-2 multisig: both parties must sign',
          },
        ],
        description: 'Spend: Immediate multicSig',
      },
      {
        type: 'OP_ELSE',
        children: [
          {
            type: 'OP_CHECKSEQUENCEVERIFY',
            children: [
              {
                type: 'OP_PUSH',
                value: timelockBlocks.toString(),
                hex: timelockBlocks.toString(16),
                children: [],
                description: `Timelock: ${timelockBlocks} blocks (~${Math.round(timelockBlocks / 144)} days)`,
              },
            ],
            description: 'Time-locked refund path',
          },
        ],
        description: 'Alternative: Timelock path',
      },
      {
        type: 'OP_ENDIF',
        children: [],
        description: 'End of script',
      },
    ],
    description: `2-of-2 Multisig Escrow with ${timelockBlocks}-block refund path (Miniscript)`,
  };
}

/** Convert script tree to visual HTML */
export function scriptToHtml(node: ScriptNode, depth: number = 0): string {
  const indent = '  '.repeat(depth);
  const hasChildren = node.children.length > 0;
  
  let html = `${indent}<div class="script-node" style="margin-left: ${depth * 16}px">\n`;
  html += `${indent}  <span style="font-family: monospace; color: #8c8c8c;">${node.type}</span>\n`;
  if (node.value) {
    html += `${indent}  <span style="color: #ff9f1c;"> ${escapeHtml(node.value)}</span>\n`;
  }
  if (node.hex) {
    html += `${indent}  <span style="color: #86ef10;"> 0x${escapeHtml(node.hex)}</span>\n`;
  }
  html += `${indent}  <span style="color: #a1a1aa;"> (${escapeHtml(node.description)})</span>\n`;
  if (hasChildren) {
    html += `${indent}  <div class="children">\n`;
    for (const child of node.children) {
      html += scriptToHtml(child, depth + 1);
    }
    html += `${indent}  </div>\n`;
  }
  html += `${indent}</div>\n`;
  return html;
}

/** Escape HTML entities */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[m]!));
}