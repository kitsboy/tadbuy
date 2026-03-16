import { pay, getWalletInfo } from 'ln-service';
import { authenticatedLndGrpc } from 'ln-service';

// Initialize the LND connection
const { lnd } = authenticatedLndGrpc({
  cert: process.env.UMBREL_LND_CERT,
  macaroon: process.env.UMBREL_LND_MACAROON,
  socket: process.env.UMBREL_LND_SOCKET,
});

/**
 * Verifies the connection to the Lightning node.
 */
export async function getLightningNodeInfo() {
  try {
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
