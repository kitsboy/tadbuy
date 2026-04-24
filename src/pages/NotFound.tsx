import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
    >
      {/* Glowing 404 */}
      <div className="relative mb-8">
        <div className="text-[140px] font-extrabold tracking-tighter leading-none text-surface select-none pointer-events-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[140px] font-extrabold tracking-tighter leading-none bg-gradient-to-br from-accent via-accent/60 to-transparent bg-clip-text text-transparent select-none">
            404
          </div>
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 blur-3xl opacity-20 bg-accent rounded-full scale-75" />
      </div>

      {/* Message */}
      <h1 className="text-2xl font-extrabold tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-muted max-w-sm mb-10 leading-relaxed">
        This route doesn&apos;t exist on the network. It may have been moved,
        deleted, or you may have followed a broken link.
      </p>

      {/* Bitcoin-flavored detail */}
      <div className="font-mono text-[11px] text-muted bg-surface border border-border px-4 py-2 rounded-full mb-10 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
        Block not found on chain — height unknown
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/">
          <Button className="gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </Link>
        <Link to="/marketplace">
          <Button variant="secondary" className="gap-2">
            <Search className="w-4 h-4" />
            Browse Marketplace
          </Button>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </motion.div>
  );
}
