import { useParams } from 'react-router-dom';
import { campaigns, getPlatformIcon } from '@/data/campaigns';
import { Card, CardTitle } from '@/components/ui';

export default function AdEmbed() {
  const { id } = useParams();
  const campaign = campaigns.find(c => c.id === id);

  if (!campaign) return <div className="p-4 text-red">Campaign not found</div>;

  const PlatformIcon = getPlatformIcon(campaign.platforms[0]);

  return (
    <div className="p-4 bg-bg min-h-screen flex items-center justify-center">
      <Card 
        className="w-full max-w-[400px] border-accent/20 shadow-[0_0_20px_rgba(247,147,26,0.05)] overflow-hidden relative group"
        style={{ 
          backgroundColor: `hsl(${campaign.bgHue || 240}, 40%, ${campaign.bgLightness || 96}%)`, 
          color: campaign.textColor || "#18181b" 
        }}
      >
        <div className="absolute top-2 right-2 bg-black/10 rounded text-[8px] px-1.5 py-0.5 font-bold tracking-wider uppercase opacity-70">Sponsored</div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center border border-black/5">
            <PlatformIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-extrabold leading-none">giveabit.io</div>
            <div className="text-[9px] opacity-70">@giveabit · Promoted</div>
          </div>
        </div>

        <div className="text-sm font-extrabold mb-1 leading-tight">{campaign.headline || "Headline"}</div>
        <div className="text-[11px] leading-relaxed opacity-90 mb-3">{campaign.description || "Description"}</div>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-black/5">
          <div className="text-[10px] font-bold opacity-80">🔗 {campaign.url?.replace(/^https?:\/\//, '') || "example.com"}</div>
          <div className="flex items-center gap-1">
            <img src="https://camtaylor.ca/wp-content/uploads/2019/02/Bitcoin.svg.png" alt="BTC" className="w-3 h-3" referrerPolicy="no-referrer" />
            <span className="text-[8px] font-bold opacity-60 uppercase tracking-widest">Tadbuy</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
