import { pay, getWalletInfo, authenticatedLndGrpc, createInvoice } from 'ln-service';

let lndInstance: any = null;

/**
 * Gets the authenticated LND instance, initializing it if necessary.
 */
function getLnd() {
  if (!lndInstance) {
    const cert = process.env.UMBREL_LND_CERT;
    const macaroon = process.env.UMBREL_LND_MACAROON;
    const socket = process.env.UMBREL_LND_SOCKET;

    if (!cert || !macaroon || !socket) {
      throw new Error('Lightning node credentials (cert, macaroon, socket) are missing. Please set UMBREL_LND_CERT, UMBREL_LND_MACAROON, and UMBREL_LND_SOCKET.');
    }

    try {
      const { lnd } = authenticatedLndGrpc({ cert, macaroon, socket });
      lndInstance = lnd;
    } catch (error) {
      console.error('Failed to initialize LND gRPC:', error);
      throw error;
    }
  }
  return lndInstance;
}

/**
 * Verifies the connection to the Lightning node.
 */
export async function getLightningNodeInfo() {
  try {
    const lnd = getLnd();
    const info = await getWalletInfo({ lnd });
    console.log('Successfully connected to node:', info.alias);
    return info;
  } catch (error) {
    console.error('Failed to connect to node:', error);
    throw error;
  }
}

/**
 * Executes a Lightning payment using the Umbrel node.
 * @param destination The Lightning invoice string (BOLT11).
 * @param tokens The amount in satoshis.
 */
export async function executeLightningPayment(destination: string, tokens: number) {
  try {
    const lnd = getLnd();
    const payment = await pay({
      lnd,
      request: destination,
      tokens,
    });
    console.log('Payment successful:', payment);
    return payment;
  } catch (error) {
    console.error('Payment failed:', error);
    throw error;
  }
}

/**
 * Creates a Lightning invoice.
 * @param tokens The amount in satoshis.
 * @param description The invoice description.
 */
export async function createLightningInvoice(tokens: number, description: string) {
  try {
    const lnd = getLnd();
    const invoice = await createInvoice({
      lnd,
      tokens,
      description,
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour expiry
    });
    console.log('Invoice created:', invoice.request);
    return invoice;
  } catch (error) {
    console.error('Failed to create invoice:', error);
    throw error;
  }
}
