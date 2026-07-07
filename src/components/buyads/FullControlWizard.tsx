import { useState } from 'react';
import type { Dispatch, SetStateAction, ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { Alert } from '@/components/ui/Alert';
import { cn } from '@/lib/utils';
import StepPlatformBudget from './StepPlatformBudget';
import StepTargeting from './StepTargeting';
import StepCreative from './StepCreative';
import StepReviewPay from './StepReviewPay';
import { CampaignTemplates, type CampaignTemplate } from './CampaignTemplates';
import { validateWizardStep } from './StepValidation';
import { useNamedDrafts } from '@/hooks/useNamedDrafts';

const STEPS = ['Budget', 'Targeting', 'Creative', 'Payment'] as const;

interface FullControlWizardProps {
  currentStep: number;
  setCurrentStep: (n: number) => void;
  platforms: Array<{ id: string; name: string; icon: ReactNode; cpm: number }>;
  checkoutPaymentMethods: Array<{ id: string; name: string; sub: string; icon: ReactNode; color: string; border: string; bg: string }>;
  selectedPlatforms: string[];
  onTogglePlatform: (id: string) => void;
  btcAmount: number;
  fiatAmount: number;
  currency: string;
  symbol: string;
  rate: number;
  onBtcChange: (v: number) => void;
  onFiatChange: (v: number) => void;
  paymentMethod: string;
  setPaymentMethod: (id: string) => void;
  campaignName: string;
  setCampaignName: (n: string) => void;
  targeting: Parameters<typeof StepTargeting>[0]['targeting'];
  setTargeting: Dispatch<SetStateAction<Parameters<typeof StepTargeting>[0]['targeting']>>;
  selectedCountries: string[];
  setSelectedCountries: Dispatch<SetStateAction<string[]>>;
  selectedLanguages: string[];
  setSelectedLanguages: Dispatch<SetStateAction<string[]>>;
  headline: string;
  setHeadline: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  url: string;
  setUrl: (v: string) => void;
  adBgHue: number;
  setAdBgHue: (v: number) => void;
  adBgLightness: number;
  setAdBgLightness: (v: number) => void;
  adTextColor: string;
  setAdTextColor: (v: string) => void;
  adImage: string | null;
  setAdImage: (v: string | null) => void;
  hashtags: string[];
  setHashtags: Dispatch<SetStateAction<string[]>>;
  hashtagInput: string;
  setHashtagInput: (v: string) => void;
  isAiGenerating: boolean;
  onGenerateAi: () => void;
  variants: Parameters<typeof StepCreative>[0]['variants'];
  selectedPlatformsData: Parameters<typeof StepCreative>[0]['selectedPlatformsData'];
  estimates: Parameters<typeof StepReviewPay>[0]['estimates'];
  projectId: string;
  onLaunch: () => void;
  onApplyTemplate?: (template: CampaignTemplate) => void;
  draftSnapshot?: Record<string, unknown>;
  onLoadDraft?: (data: Record<string, unknown>) => void;
}

export function FullControlWizard(props: FullControlWizardProps) {
  const { currentStep, setCurrentStep } = props;
  const totalSteps = STEPS.length;
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const { drafts, saveDraft, loadDraft } = useNamedDrafts();

  const next = () => {
    const result = validateWizardStep(currentStep, {
      selectedPlatforms: props.selectedPlatforms,
      btcAmount: props.btcAmount,
      headline: props.headline,
    });
    if (!result.valid) {
      setValidationErrors(result.errors);
      return;
    }
    setValidationErrors([]);
    setCurrentStep(Math.min(currentStep + 1, totalSteps));
  };

  const prev = () => {
    setValidationErrors([]);
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleApplyTemplate = (template: CampaignTemplate) => {
    setSelectedTemplateId(template.id);
    props.onApplyTemplate?.(template);
  };

  const handleSaveDraft = () => {
    if (!draftName.trim() || !props.draftSnapshot) return;
    saveDraft(draftName, props.draftSnapshot);
    setDraftName('');
  };

  const handleLoadDraft = (id: string) => {
    const draft = loadDraft(id);
    if (draft?.data) props.onLoadDraft?.(draft.data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-0 mb-2 select-none">
        {STEPS.map((label, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;
          return (
            <div key={label} className="flex items-center flex-1 min-w-0">
              <button
                type="button"
                onClick={() => { setValidationErrors([]); setCurrentStep(stepNum); }}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all w-full',
                  isActive
                    ? 'bg-accent/15 text-accent border border-accent/40'
                    : isCompleted
                      ? 'text-green hover:bg-green/10'
                      : 'text-muted hover:text-text hover:bg-surface'
                )}
              >
                <span className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-extrabold shrink-0',
                  isActive ? 'bg-accent text-black' : isCompleted ? 'bg-green/20 text-green' : 'bg-surface border border-border text-muted'
                )}>
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepNum}
                </span>
                <span className="hidden sm:block truncate">{label}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className={cn('h-px flex-1 mx-1', currentStep > stepNum + 1 ? 'bg-green/40' : currentStep > stepNum ? 'bg-accent/40' : 'bg-border')} />
              )}
            </div>
          );
        })}
      </div>

      {drafts.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted font-bold">Saved drafts:</span>
          {drafts.slice(0, 5).map(d => (
            <button
              key={d.id}
              type="button"
              onClick={() => handleLoadDraft(d.id)}
              className="px-2 py-1 rounded-lg bg-surface border border-border hover:border-accent text-muted hover:text-accent transition-colors"
            >
              {d.name}
            </button>
          ))}
        </div>
      )}

      {currentStep === 1 && (
        <>
          <CampaignTemplates onApply={handleApplyTemplate} selectedId={selectedTemplateId} />
          <StepPlatformBudget
            platforms={props.platforms}
            paymentMethods={props.checkoutPaymentMethods}
            selectedPlatforms={props.selectedPlatforms}
            onTogglePlatform={props.onTogglePlatform}
            btcAmount={props.btcAmount}
            fiatAmount={props.fiatAmount}
            currency={props.currency}
            symbol={props.symbol}
            rate={props.rate}
            onBtcChange={props.onBtcChange}
            onFiatChange={props.onFiatChange}
            paymentMethod={props.paymentMethod}
            setPaymentMethod={props.setPaymentMethod}
            campaignName={props.campaignName}
            setCampaignName={props.setCampaignName}
          />
        </>
      )}
      {currentStep === 2 && (
        <StepTargeting
          targeting={props.targeting}
          setTargeting={props.setTargeting}
          selectedCountries={props.selectedCountries}
          setSelectedCountries={props.setSelectedCountries}
          selectedLanguages={props.selectedLanguages}
          setSelectedLanguages={props.setSelectedLanguages}
        />
      )}
      {currentStep === 3 && (
        <StepCreative
          headline={props.headline}
          setHeadline={props.setHeadline}
          description={props.description}
          setDescription={props.setDescription}
          url={props.url}
          setUrl={props.setUrl}
          adBgHue={props.adBgHue}
          setAdBgHue={props.setAdBgHue}
          adBgLightness={props.adBgLightness}
          setAdBgLightness={props.setAdBgLightness}
          adTextColor={props.adTextColor}
          setAdTextColor={props.setAdTextColor}
          adImage={props.adImage}
          setAdImage={props.setAdImage}
          hashtags={props.hashtags}
          setHashtags={props.setHashtags}
          hashtagInput={props.hashtagInput}
          setHashtagInput={props.setHashtagInput}
          isAiGenerating={props.isAiGenerating}
          onGenerateAi={props.onGenerateAi}
          variants={props.variants}
          selectedPlatformsData={props.selectedPlatformsData}
          campaignName={props.campaignName}
        />
      )}
      {currentStep === 4 && (
        <StepReviewPay
          estimates={props.estimates}
          btcAmount={props.btcAmount}
          fiatAmount={props.fiatAmount}
          campaignName={props.campaignName}
          selectedPlatformsData={props.selectedPlatformsData}
          onDeploy={props.onLaunch}
          paymentMethod={props.paymentMethod}
          symbol={props.symbol}
          rate={props.rate}
          projectId={props.projectId}
          targeting={props.targeting}
          mode="complex"
          variants={props.variants}
          ppqAutoRebalance={true}
        />
      )}

      {validationErrors.length > 0 && (
        <Alert variant="error" title="Complete required fields">
          <ul className="list-disc list-inside text-xs space-y-0.5">
            {validationErrors.map(e => <li key={e}>{e}</li>)}
          </ul>
        </Alert>
      )}

      {currentStep < 4 && (
        <div className="flex justify-between gap-3 items-center">
          <Button variant="secondary" onClick={prev} disabled={currentStep === 1}>Back</Button>
          <div className="flex items-center gap-2">
            {props.draftSnapshot && (
              <>
                <input
                  type="text"
                  value={draftName}
                  onChange={e => setDraftName(e.target.value)}
                  placeholder="Draft name"
                  className="bg-surface border border-border rounded-lg px-2 py-1.5 text-xs w-28"
                />
                <Button variant="secondary" size="sm" onClick={handleSaveDraft} disabled={!draftName.trim()}>
                  Save draft
                </Button>
              </>
            )}
            <Button onClick={next}>Continue</Button>
          </div>
        </div>
      )}
      {currentStep > 1 && currentStep < 4 && (
        <p className="text-[10px] text-muted text-center">Step {currentStep} of {totalSteps}</p>
      )}
    </div>
  );
}