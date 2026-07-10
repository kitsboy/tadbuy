import type { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { Card, CardTitle, Input, Select, FormGroup, Label, InfoTooltip } from "@/components/ui";
import { Alert } from "@/components/ui/Alert";
import { Globe, Map as MapIcon, X } from "lucide-react";
import { GEO_MARKETS } from "@/data/geoMarkets";
import { cn } from "@/lib/utils";

interface TargetingSettings {
  interests: string;
  ageMin: number;
  ageMax: number;
  sex: 'all' | 'male' | 'female';
  countries: string[];
  languages: string[];
  devices: string[];
  networks: string[];
  pixelUrl: string;
  education: string;
  income: string;
  behaviors: string;
  industries: string;
}

interface StepTargetingProps {
  targeting: TargetingSettings;
  setTargeting: Dispatch<SetStateAction<TargetingSettings>>;
  selectedCountries: string[];
  setSelectedCountries: Dispatch<SetStateAction<string[]>>;
  selectedLanguages: string[];
  setSelectedLanguages: Dispatch<SetStateAction<string[]>>;
}

const availableCountries = [
  'Global',
  ...GEO_MARKETS.map(m => m.country),
];

const COUNTRY_META = new globalThis.Map(
  GEO_MARKETS.map(m => [m.country, { flag: m.flag, code: m.code, priority: m.priority }] as const),
);

const QUICK_MARKETS = GEO_MARKETS.filter(m => m.priority === 'P1').slice(0, 8);

const availableLanguages = [
  'English', 'Spanish', 'French', 'German', 'Portuguese',
  'Japanese', 'Chinese', 'Arabic', 'Hindi', 'Russian',
];

function toggleCountry(
  country: string,
  selected: string[],
  setSelected: Dispatch<SetStateAction<string[]>>,
) {
  if (country === 'Global') {
    setSelected(['Global']);
    return;
  }
  if (selected.includes(country)) {
    const next = selected.filter(c => c !== country);
    setSelected(next.length ? next : ['Global']);
    return;
  }
  setSelected([...selected.filter(c => c !== 'Global'), country]);
}

export default function StepTargeting({
  targeting,
  setTargeting,
  selectedCountries,
  setSelectedCountries,
  selectedLanguages,
  setSelectedLanguages,
}: StepTargetingProps) {
  return (
    <Card className="glass-panel">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="mb-0">Target demographics</CardTitle>
          <InfoTooltip content="Define who should see your ads. Narrow targeting can improve conversion rates." />
        </div>
        <Link
          to="/geo"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 min-h-[44px] touch-target touch-manipulation"
        >
          <MapIcon className="w-3.5 h-3.5" />
          Explore markets on map
        </Link>
      </div>

      <Alert variant="info" title="Cookieless targeting" className="mb-5">
        Tadbuy uses contextual and interest-based segments — no third-party tracking pixels. Your audience data stays sovereign.
      </Alert>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormGroup className="mb-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Label className="mb-0">Audience interest</Label>
            <InfoTooltip content="Target users based on their hobbies, topics they follow, and content they consume." />
          </div>
          <Select value={targeting.interests} onChange={e => setTargeting({ ...targeting, interests: e.target.value })}>
            <option>Bitcoin & Crypto</option>
            <option>Finance & Investing</option>
            <option>Tech & Software</option>
            <option>Gaming & Esports</option>
            <option>Small Business & B2B</option>
            <option>Health & Fitness</option>
            <option>Travel & Hospitality</option>
            <option>Real Estate</option>
            <option>Fashion & Beauty</option>
            <option>Food & Beverage</option>
            <option>Automotive</option>
            <option>Entertainment & Media</option>
          </Select>
        </FormGroup>
        <FormGroup className="mb-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Label className="mb-0">Age range</Label>
            <InfoTooltip content="Specify the age group of the users you want to reach." />
          </div>
          <div className="flex gap-3">
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Min"
              className="min-h-[44px]"
              value={targeting.ageMin}
              onChange={e => setTargeting({ ...targeting, ageMin: parseInt(e.target.value) || 0 })}
            />
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Max"
              className="min-h-[44px]"
              value={targeting.ageMax}
              onChange={e => setTargeting({ ...targeting, ageMax: parseInt(e.target.value) || 0 })}
            />
          </div>
        </FormGroup>

        <FormGroup className="mb-0 sm:col-span-2">
          <Alert variant="warning" className="mb-4">
            Selecting &quot;Global&quot; clears other countries. Narrow geo targeting typically improves CTR by 15–25%.
          </Alert>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent shrink-0" />
              <Label className="mb-0">Target countries</Label>
              <InfoTooltip content="Select the geographic locations where your ads should be displayed." />
            </div>
            <span className="text-[10px] font-mono text-muted">
              {selectedCountries.includes('Global')
                ? 'Worldwide'
                : `${selectedCountries.length} market${selectedCountries.length === 1 ? '' : 's'}`}
            </span>
          </div>

          {/* Selected chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedCountries.map(c => {
              const meta = COUNTRY_META.get(c);
              return (
                <span
                  key={c}
                  className="bg-accent/10 border border-accent/30 text-text pl-2.5 pr-1 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 min-h-[36px]"
                >
                  {meta?.flag ? <span aria-hidden>{meta.flag}</span> : null}
                  <span>{c}</span>
                  {meta?.code && (
                    <span className="font-mono text-[10px] text-muted">{meta.code}</span>
                  )}
                  <button
                    type="button"
                    aria-label={`Remove ${c}`}
                    onClick={() => toggleCountry(c, selectedCountries, setSelectedCountries)}
                    className="ml-0.5 p-1.5 rounded-full hover:bg-accent/20 hover:text-accent transition-colors touch-manipulation min-w-[32px] min-h-[32px] flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              );
            })}
          </div>

          {/* Quick-pick P1 markets */}
          <p className="text-[10px] font-mono text-muted mb-2 uppercase tracking-wide">Quick pick · high priority</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              type="button"
              onClick={() => setSelectedCountries(['Global'])}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-semibold border transition-all min-h-[44px] touch-target touch-manipulation',
                selectedCountries.includes('Global')
                  ? 'bg-accent text-black border-accent'
                  : 'bg-surface border-border text-muted hover:border-accent/50 hover:text-text',
              )}
            >
              🌍 Global
            </button>
            {QUICK_MARKETS.map(m => {
              const active = selectedCountries.includes(m.country);
              return (
                <button
                  key={m.code}
                  type="button"
                  onClick={() => toggleCountry(m.country, selectedCountries, setSelectedCountries)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-xs font-semibold border transition-all min-h-[44px] touch-target touch-manipulation',
                    active
                      ? 'bg-accent/15 text-accent border-accent/40'
                      : 'bg-surface border-border text-muted hover:border-accent/50 hover:text-text',
                  )}
                >
                  {m.flag} {m.code}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              className="min-h-[44px]"
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  toggleCountry(e.target.value, selectedCountries, setSelectedCountries);
                }
              }}
            >
              <option value="" disabled>+ Add country</option>
              {availableCountries.map(c => {
                const meta = COUNTRY_META.get(c);
                const label = meta ? `${meta.flag} ${c}` : c;
                return (
                  <option key={c} value={c} disabled={selectedCountries.includes(c)}>
                    {label}
                  </option>
                );
              })}
            </Select>
            <Input className="min-h-[44px]" placeholder="State / Province (Optional)" />
            <Input className="min-h-[44px]" placeholder="City / Local Area (Optional)" />
          </div>
        </FormGroup>

        <FormGroup className="mb-0 sm:col-span-2">
          <div className="flex items-center gap-2 mb-1.5">
            <Label className="mb-0">Target languages</Label>
            <InfoTooltip content="Reach users who speak specific languages." />
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedLanguages.map(l => (
              <span
                key={l}
                className="bg-surface border border-border text-text pl-2.5 pr-1 py-1.5 rounded-full text-xs flex items-center gap-1 min-h-[36px]"
              >
                {l}
                <button
                  type="button"
                  aria-label={`Remove ${l}`}
                  onClick={() => setSelectedLanguages(ls => ls.filter(x => x !== l))}
                  className="p-1.5 rounded-full hover:text-accent hover:bg-white/5 transition-colors touch-manipulation min-w-[32px] min-h-[32px] flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          <Select
            className="min-h-[44px]"
            value=""
            onChange={(e) => {
              if (e.target.value && !selectedLanguages.includes(e.target.value)) {
                setSelectedLanguages([...selectedLanguages, e.target.value]);
              }
            }}
          >
            <option value="" disabled>+ Add language</option>
            {availableLanguages.map(l => (
              <option key={l} value={l} disabled={selectedLanguages.includes(l)}>
                {l}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup className="mb-0">
          <Label>Sex</Label>
          <Select
            className="min-h-[44px]"
            value={targeting.sex}
            onChange={e => setTargeting({ ...targeting, sex: e.target.value as 'all' | 'male' | 'female' })}
          >
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
        </FormGroup>
        <FormGroup className="mb-0">
          <Label>Education level</Label>
          <Select
            className="min-h-[44px]"
            value={targeting.education}
            onChange={e => setTargeting({ ...targeting, education: e.target.value })}
          >
            <option>All Education Levels</option>
            <option>High School</option>
            <option>Some College</option>
            <option>Bachelors Degree</option>
            <option>Masters Degree</option>
            <option>PhD / Doctorate</option>
          </Select>
        </FormGroup>
        <FormGroup className="mb-0">
          <Label>Income bracket</Label>
          <Select
            className="min-h-[44px]"
            value={targeting.income}
            onChange={e => setTargeting({ ...targeting, income: e.target.value })}
          >
            <option>All Incomes</option>
            <option>Top 10%</option>
            <option>Top 25%</option>
            <option>Top 50%</option>
            <option>Below Average</option>
          </Select>
        </FormGroup>
        <FormGroup className="mb-0">
          <Label>Behaviors</Label>
          <Select
            className="min-h-[44px]"
            value={targeting.behaviors}
            onChange={e => setTargeting({ ...targeting, behaviors: e.target.value })}
          >
            <option>All Behaviors</option>
            <option>Crypto Traders</option>
            <option>Frequent Buyers</option>
            <option>Tech Early Adopters</option>
            <option>Business Travelers</option>
            <option>Luxury Shoppers</option>
            <option>Gamers</option>
            <option>Investors</option>
          </Select>
        </FormGroup>
        <FormGroup className="mb-0 sm:col-span-2">
          <Label>Job industries</Label>
          <Select
            className="min-h-[44px]"
            value={targeting.industries}
            onChange={e => setTargeting({ ...targeting, industries: e.target.value })}
          >
            <option>All Industries</option>
            <option>Technology & IT</option>
            <option>Finance & Banking</option>
            <option>Healthcare & Medical</option>
            <option>Retail & E-commerce</option>
            <option>Education</option>
            <option>Construction & Real Estate</option>
            <option>Manufacturing</option>
            <option>Marketing & Advertising</option>
            <option>Arts & Design</option>
          </Select>
        </FormGroup>
      </div>
    </Card>
  );
}
