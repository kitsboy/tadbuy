import { Link } from "react-router-dom";
import { FileQuestion, Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <EmptyState
        icon={FileQuestion}
        title="Page Not Found"
        description="This route doesn't exist on the network. It may have been moved, deleted, or you may have followed a broken link."
        className="max-w-lg"
      >
        <div className="font-mono text-[11px] text-muted bg-surface border border-border px-4 py-2 rounded-full mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
          Block not found on chain — height unknown
        </div>
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
      </EmptyState>
    </div>
  );
}