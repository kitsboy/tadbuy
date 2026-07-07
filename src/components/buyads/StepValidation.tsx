export interface WizardStepData {
  selectedPlatforms: string[];
  btcAmount: number;
  headline: string;
  minBudgetBtc?: number;
}

export interface WizardValidationResult {
  valid: boolean;
  errors: string[];
}

const MIN_BUDGET_BTC = 0.0001;

/** Validate a wizard step before allowing Continue */
export function validateWizardStep(step: number, data: WizardStepData): WizardValidationResult {
  const errors: string[] = [];
  const minBudget = data.minBudgetBtc ?? MIN_BUDGET_BTC;

  if (step === 1) {
    if (!data.selectedPlatforms.length) {
      errors.push('Select at least one platform');
    }
    if (!data.btcAmount || data.btcAmount < minBudget) {
      errors.push(`Minimum budget is ${minBudget} BTC`);
    }
  }

  if (step === 3) {
    if (!data.headline?.trim()) {
      errors.push('Headline is required');
    }
  }

  return { valid: errors.length === 0, errors };
}

/** Human-readable label for the current step validation block */
export function stepValidationLabel(step: number): string {
  if (step === 1) return 'Platform & budget';
  if (step === 3) return 'Creative';
  return '';
}