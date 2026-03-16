import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';
import { Zap, Users, Target } from 'lucide-react';

interface Node {
  id: string;
  type: 'advertiser' | 'publisher';
  x: number;
  y: number;
}

interface Link {
  source: Node;
  target: Node;
  id: string;
}

export default function Pulse() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [stats, setStats] = useState({ sats: 0, clicks: 0 });

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 500;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create nodes
    const nodes: Node[] = [
      { id: 'adv1', type: 'advertiser', x: 100, y: 250 },
      { id: 'adv2', type: 'advertiser', x: 100, y: 150 },
      { id: 'pub1', type: 'publisher', x: 700, y: 150 },
      { id: 'pub2', type: 'publisher', x: 700, y: 250 },
      { id: 'pub3', type: 'publisher', x: 700, y: 350 },
    ];

    // Draw nodes
    svg.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 20)
      .attr('fill', d => d.type === 'advertiser' ? '#f7931a' : '#ffffff')
      .attr('stroke', '#27272a')
      .attr('stroke-width', 2);

    // Simulation loop for pulses
    const interval = setInterval(() => {
      const source = nodes[Math.floor(Math.random() * 2)];
      const target = nodes[2 + Math.floor(Math.random() * 3)];
      
      const pulse = svg.append('circle')
        .attr('cx', source.x)
        .attr('cy', source.y)
        .attr('r', 5)
        .attr('fill', '#f7931a');

      pulse.transition()
        .duration(1000)
        .attr('cx', target.x)
        .attr('cy', target.y)
        .remove();

      setStats(prev => ({
        sats: prev.sats + Math.floor(Math.random() * 1000),
        clicks: prev.clicks + 1
      }));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-extrabold tracking-tighter text-text">Live Pulse</h1>
        <div className="flex gap-4">
          <div className="bg-surface p-4 rounded-2xl border border-border flex items-center gap-3">
            <Zap className="text-accent w-6 h-6" />
            <div>
              <div className="text-xs text-muted uppercase font-bold">Sats Settled</div>
              <div className="text-xl font-mono font-bold text-text">{stats.sats.toLocaleString()}</div>
            </div>
          </div>
          <div className="bg-surface p-4 rounded-2xl border border-border flex items-center gap-3">
            <Target className="text-accent w-6 h-6" />
            <div>
              <div className="text-xs text-muted uppercase font-bold">Live Clicks</div>
              <div className="text-xl font-mono font-bold text-text">{stats.clicks.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-3xl border border-border p-8 shadow-inner"
      >
        <svg ref={svgRef} width="100%" height="500" viewBox="0 0 800 500" className="w-full" />
      </motion.div>
    </div>
  );
}
