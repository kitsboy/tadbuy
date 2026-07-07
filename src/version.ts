/**
 * Live app version — always derived from package.json (auto-bumped on push).
 * Footer and UI import APP_VERSION from here or @/constants.
 */
import pkg from '../package.json';

export const APP_VERSION_RAW = pkg.version;
export const APP_VERSION = `v${pkg.version}`;