import { type ChangeEvent, type Dispatch, type SetStateAction, type ReactNode } from "react";
import { Card, CardTitle, Button, Input, Textarea, FormGroup, Label, FileInput, InfoTooltip } from "@/components/ui";
import { Bot, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdVariant {
  id: string;
  headline: string;
  description: string;
  url: string;
  bgHue: number;
  bgLightness: number;
  textColor: string;
  hashtags: string[];
}

interface StepCreativeProps {
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
  variants: AdVariant[];
  selectedPlatformsData: Array<{ id: string; name: string; icon: ReactNode; cpm: number }>;
}

const trendingTags = ['#bitcoin', '#nostr', '#lightning', '#plebs', '#zap', '@jack', '@elonmusk', '#crypto', '#localmusic', '#livemusic', '#atx', '#sats'];

export default function StepCreative({
  headline,
  setHeadline,
  description,
  setDescription,
  url,
  setUrl,
  adBgHue,
  setAdBgHue,
  adBgLightness,
  setAdBgLightness,
  adTextColor,
  setAdTextColor,
  adImage,
  setAdImage,
  hashtags,
  setHashtags,
  hashtagInput,
  setHashtagInput,
  isAiGenerating,
  onGenerateAi,
  variants,
  selectedPlatformsData,
}: StepCreativeProps) {
  const filteredTags = trendingTags.filter(t => t.toLowerCase().includes(hashtagInput.toLowerCase()) && !hashtags.includes(t));

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Card className="glass-panel">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="mb-0">4. Ad copy & Media</CardTitle>
            <InfoTooltip content="Craft your message. PPQ.AI will automatically format this for each selected platform." />
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={onGenerateAi}
            disabled={isAiGenerating}
            className="text-[10px] h-7 gap-1.5"
          >
            <Bot className={cn("w-3 h-3", isAiGenerating && "animate-spin")} />
            {isAiGenerating ? "Thinking..." : "AI Suggest"}
          </Button>
        </div>
        <div className="bg-blue/5 border border-blue/20 rounded-lg p-3.5 mb-5 flex items-start gap-3">
          <Bot className="w-5 h-5 text-blue shrink-0 mt-0.5" />
          <div>
            <div className="text-[12px] font-bold text-blue mb-1">Powered by PPQ.AI</div>
            <div className="text-[11px] text-muted leading-relaxed">
              Create once, deploy everywhere. PPQ.AI connects directly to Twitter, Reddit, and other vendors via API. Your ad stays on balance—top it up with Bitcoin anytime to extend its life without recreating it.
            </div>
          </div>
        </div>
        <FormGroup>
          <Label>Headline</Label>
          <Input value={headline} onChange={e => setHeadline(e.target.value)} maxLength={70} />
        </FormGroup>
        <FormGroup>
          <Label>Description</Label>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} />
        </FormGroup>
        <FormGroup>
          <Label>Destination URL</Label>
          <Input type="url" value={url} onChange={e => setUrl(e.target.value)} />
        </FormGroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormGroup className="mb-0">
            <div className="flex justify-between items-center mb-1">
              <Label className="mb-0">Ad Background Color</Label>
              <div
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ backgroundColor: `hsl(${adBgHue}, 40%, ${adBgLightness}%)` }}
              />
            </div>
            <div className="space-y-3 p-3 bg-surface/50 rounded-lg border border-border">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted uppercase font-bold">
                  <span>Hue</span>
                  <span>{adBgHue}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={adBgHue}
                  onChange={e => setAdBgHue(Number(e.target.value))}
                  className="w-full h-1.5 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted uppercase font-bold">
                  <span>Lightness</span>
                  <span>{adBgLightness}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="98"
                  value={adBgLightness}
                  onChange={e => setAdBgLightness(Number(e.target.value))}
                  className="w-full h-1.5 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>
            </div>
          </FormGroup>
          <FormGroup className="mb-0">
            <Label>Ad Text Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={adTextColor}
                onChange={e => setAdTextColor(e.target.value)}
                className="w-12 h-10 p-1 bg-surface border-border cursor-pointer"
              />
              <Input
                type="text"
                value={adTextColor}
                onChange={e => setAdTextColor(e.target.value)}
                className="font-mono text-xs"
                placeholder="#000000"
              />
            </div>
            <div className="flex gap-1.5 mt-2">
              {['#000000', '#FFFFFF', '#F7931A', '#18181b'].map(c => (
                <button
                  key={c}
                  onClick={() => setAdTextColor(c)}
                  className="w-5 h-5 rounded border border-white/10 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </FormGroup>
        </div>
        <FormGroup>
          <Label>Media (Optional) <span className="text-accent font-normal text-[10px] ml-2 bg-accent/10 px-2 py-0.5 rounded">Ad Space: 1200 x 628 px</span></Label>
          <FileInput
            hint={adImage ? "Image uploaded ✓" : "Max size: 5MB • Recommended: 1200 x 628 px"}
            onChange={handleImageUpload}
          />
          {adImage && (
            <div className="mt-2 relative inline-block">
              <img src={adImage} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-border" />
              <button
                onClick={() => setAdImage(null)}
                className="absolute -top-2 -right-2 bg-red text-white rounded-full p-1 shadow-lg hover:bg-red/80 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </FormGroup>
        <FormGroup>
          <Label>Hashtags & Mentions (Max 3)</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {hashtags.map(tag => (
              <span key={tag} className="bg-accent/20 text-accent px-2 py-1 rounded-md text-xs flex items-center gap-1">
                {tag}
                <button onClick={() => setHashtags(hs => hs.filter(h => h !== tag))} className="hover:text-white transition-colors">
                  <X className="w-3 h-3"/>
                </button>
              </span>
            ))}
          </div>
          {hashtags.length < 3 && (
            <div className="relative">
              <Input
                value={hashtagInput}
                onChange={e => setHashtagInput(e.target.value)}
                placeholder="Type # or @ to see trending..."
                onKeyDown={e => {
                  if (e.key === 'Enter' && hashtagInput) {
                    e.preventDefault();
                    setHashtags(prev => [...prev, hashtagInput]);
                    setHashtagInput('');
                  }
                }}
              />
              {hashtagInput && filteredTags.length > 0 && (
                <div className="absolute z-10 w-full bg-surface border border-border mt-1 rounded-md shadow-lg overflow-hidden">
                  {filteredTags.slice(0, 5).map(tag => (
                    <div
                      key={tag}
                      className="px-3 py-2 text-sm hover:bg-accent/10 cursor-pointer transition-colors"
                      onClick={() => {
                        setHashtags(prev => [...prev, tag]);
                        setHashtagInput('');
                      }}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </FormGroup>
      </Card>

      {/* Ad preview card */}
      <Card className="glass-panel">
        <CardTitle>Ad preview — {selectedPlatformsData[0]?.name} {selectedPlatformsData.length > 1 ? `(+${selectedPlatformsData.length - 1} more)` : ''}</CardTitle>
        <div className="space-y-4">
          {variants.map((v) => (
            <div key={v.id} className="space-y-2">
              {variants.length > 1 && <div className="text-[10px] font-bold text-accent uppercase tracking-widest">Variant {v.id}</div>}
              <div
                className="rounded-xl p-4 min-h-[120px] relative overflow-hidden shadow-inner border border-border transition-colors duration-200"
                style={{ backgroundColor: `hsl(${v.bgHue}, 40%, ${v.bgLightness}%)`, color: v.textColor }}
              >
                <div className="absolute top-2 right-2 bg-black/10 rounded text-[9px] px-1.5 py-0.5 font-bold tracking-wider uppercase opacity-70">Sponsored</div>
                <div className="text-[10px] mb-2 flex items-center gap-1.5 opacity-80">
                  <span className="w-4 h-4 [&>svg]:w-4 [&>svg]:h-4">{selectedPlatformsData[0]?.icon}</span> <strong>giveabit.io</strong> <span className="opacity-70">@giveabit · Promoted</span>
                </div>
                <div className="text-[15px] font-bold mb-1 leading-tight">{v.headline || "Your Headline Here"}</div>
                <div className="text-[13px] leading-relaxed opacity-90">{v.description || "Your description will appear here."}</div>

                {adImage && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-black/10">
                    <img src={adImage} alt="Ad Media" className="w-full h-auto object-cover max-h-[200px]" />
                  </div>
                )}

                {v.hashtags.length > 0 && (
                  <div className="text-[12px] mt-2 font-medium opacity-80" style={{ color: v.textColor }}>
                    {v.hashtags.join(' ')}
                  </div>
                )}

                <div className="text-[11px] mt-3 font-medium opacity-80" style={{ color: v.textColor }}>🔗 {v.url.replace(/^https?:\/\//, '') || "example.com"}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
