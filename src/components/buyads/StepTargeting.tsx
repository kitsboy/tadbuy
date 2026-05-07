import type { Dispatch, SetStateAction } from "react";
import { Card, CardTitle, Input, Select, FormGroup, Label, InfoTooltip } from "@/components/ui";
import { X } from "lucide-react";

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
  'Global', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Spain', 'Mexico', 'Brazil', 'Japan', 'India', 'El Salvador',
  'Argentina', 'Colombia', 'Nigeria', 'South Africa',
];

const availableLanguages = [
  'English', 'Spanish', 'French', 'German', 'Portuguese',
  'Japanese', 'Chinese', 'Arabic', 'Hindi', 'Russian',
];

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
      <div className="flex items-center gap-2 mb-3">
        <CardTitle className="mb-0">Target demographics</CardTitle>
        <InfoTooltip content="Define who should see your ads. Narrow targeting can improve conversion rates." />
      </div>
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
            <Input type="number" placeholder="Min" value={targeting.ageMin} onChange={e => setTargeting({ ...targeting, ageMin: parseInt(e.target.value) || 0 })} />
            <Input type="number" placeholder="Max" value={targeting.ageMax} onChange={e => setTargeting({ ...targeting, ageMax: parseInt(e.target.value) || 0 })} />
          </div>
        </FormGroup>
        <FormGroup className="mb-0 sm:col-span-2">
          <div className="flex items-center gap-2 mb-1.5">
            <Label className="mb-0">Target Countries</Label>
            <InfoTooltip content="Select the geographic locations where your ads should be displayed." />
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedCountries.map(c => (
              <span key={c} className="bg-surface border border-border text-text px-2 py-1 rounded-md text-xs flex items-center gap-1">
                {c}
                <button onClick={() => setSelectedCountries(cs => cs.filter(x => x !== c))} className="hover:text-accent transition-colors">
                  <X className="w-3 h-3"/>
                </button>
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              value=""
              onChange={(e) => {
                if (e.target.value && !selectedCountries.includes(e.target.value)) {
                  const newCountries = e.target.value === 'Global'
                    ? ['Global']
                    : [...selectedCountries.filter(c => c !== 'Global'), e.target.value];
                  setSelectedCountries(newCountries);
                }
              }}
            >
              <option value="" disabled>+ Add Country</option>
              {availableCountries.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Input placeholder="State / Province (Optional)" />
            <Input placeholder="City / Local Area (Optional)" />
          </div>
        </FormGroup>
        <FormGroup className="mb-0 sm:col-span-2">
          <div className="flex items-center gap-2 mb-1.5">
            <Label className="mb-0">Target Languages</Label>
            <InfoTooltip content="Reach users who speak specific languages." />
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedLanguages.map(l => (
              <span key={l} className="bg-surface border border-border text-text px-2 py-1 rounded-md text-xs flex items-center gap-1">
                {l}
                <button onClick={() => setSelectedLanguages(ls => ls.filter(x => x !== l))} className="hover:text-accent transition-colors">
                  <X className="w-3 h-3"/>
                </button>
              </span>
            ))}
          </div>
          <Select
            value=""
            onChange={(e) => {
              if (e.target.value && !selectedLanguages.includes(e.target.value)) {
                setSelectedLanguages([...selectedLanguages, e.target.value]);
              }
            }}
          >
            <option value="" disabled>+ Add Language</option>
            {availableLanguages.map(l => <option key={l} value={l}>{l}</option>)}
          </Select>
        </FormGroup>
        <FormGroup className="mb-0">
          <Label>Sex</Label>
          <Select value={targeting.sex} onChange={e => setTargeting({ ...targeting, sex: e.target.value as 'all' | 'male' | 'female' })}>
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
        </FormGroup>
        <FormGroup className="mb-0">
          <Label>Education Level</Label>
          <Select value={targeting.education} onChange={e => setTargeting({ ...targeting, education: e.target.value })}>
            <option>All Education Levels</option>
            <option>High School</option>
            <option>Some College</option>
            <option>Bachelors Degree</option>
            <option>Masters Degree</option>
            <option>PhD / Doctorate</option>
          </Select>
        </FormGroup>
        <FormGroup className="mb-0">
          <Label>Income Bracket</Label>
          <Select value={targeting.income} onChange={e => setTargeting({ ...targeting, income: e.target.value })}>
            <option>All Incomes</option>
            <option>Top 10%</option>
            <option>Top 25%</option>
            <option>Top 50%</option>
            <option>Below Average</option>
          </Select>
        </FormGroup>
        <FormGroup className="mb-0">
          <Label>Behaviors</Label>
          <Select value={targeting.behaviors} onChange={e => setTargeting({ ...targeting, behaviors: e.target.value })}>
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
        <FormGroup className="mb-0">
          <Label>Job Industries</Label>
          <Select value={targeting.industries} onChange={e => setTargeting({ ...targeting, industries: e.target.value })}>
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
