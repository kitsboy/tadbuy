import { Link } from "react-router-dom";
import { Card, Button } from "@/components/ui";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Badge } from "@/components/ui/Badge";

/**
 * Profile — honest preview state.
 *
 * Accounts are intentionally NOT part of this preview build: the platform has
 * no account backend on the static host, so a sign-in form here would fail or
 * lie. When the real backend lands (Supabase Auth — see the sibling
 * real-backend card), this page is rebuilt around real accounts.
 */
export default function Profile() {
  usePageTitle("Profile");

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
          <span className="text-2xl">₿</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Your profile</h1>
        <p className="text-sm text-muted mt-1.5">Accounts are not part of this preview build.</p>
      </div>

      <Card className="glass-panel">
        <div className="space-y-4 p-1">
          <div className="flex justify-center">
            <Badge variant="warning" className="gap-1.5" data-account-preview="true">
              🔐 Accounts not available yet
            </Badge>
          </div>
          <p className="text-sm text-muted leading-relaxed text-center">
            TadBuy is a preview of the product — there is no account backend on
            this build yet, so signing in isn't possible here (and we won't
            pretend otherwise).
          </p>
          <p className="text-sm text-muted leading-relaxed text-center">
            You can plan, build and preview a campaign right now without an
            account, and everything stays on your device. Account features —
            saved campaigns, a wallet, analytics — arrive with the real backend.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Link to="/">
              <Button className="w-full gap-2">Start building a campaign</Button>
            </Link>
            <Link to="/beta">
              <Button variant="secondary" className="w-full gap-2">
                See what's coming
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
