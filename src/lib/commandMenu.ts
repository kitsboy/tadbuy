/** Open the command palette from UI clicks (keyboard synthesis is unreliable in browsers). */
export const COMMAND_MENU_OPEN_EVENT = 'tadbuy:open-command-menu';

export function openCommandMenu() {
  document.dispatchEvent(new CustomEvent(COMMAND_MENU_OPEN_EVENT));
}