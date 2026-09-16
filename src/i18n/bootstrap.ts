import { applyDocumentDirection, onLangChange } from './lang.ts';

/** Runs `init` once, applies the initial text direction, and re-runs `init` on every language change. */
export function bootstrapI18n(init: () => void): void {
  applyDocumentDirection();
  init();
  onLangChange(() => init());
}
