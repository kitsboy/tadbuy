import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "@/firebase";
import { useAuth } from "@/components/AuthProvider";
import { LocalAvatar } from "@/components/LocalAvatar";
import { Card, Button, Input, Label, FormGroup } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { usePageTitle } from "@/hooks/usePageTitle";
import { LogOut, Settings, Loader2, Eye, EyeOff, Mail, Lock, UserPlus } from "lucide-react";

// ─── Google SVG icon ────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="w-4 h-4" aria-hidden>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.16 7.09-10.29 7.09-17.65z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    <path fill="#FBBC05" d="M10.53 28.58A14.9 14.9 0 0 1 9.5 24c0-1.59.27-3.12.76-4.58l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.46 10.51l8.07-5.93z" />
    <path fill="#EA4335" d="M24 9.52c3.52 0 6.69 1.21 9.19 3.57l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.46 13.23l7.98 6.19C12.43 13.74 17.74 9.52 24 9.52z" />
  </svg>
);

// ─── Friendly Firebase error messages ────────────────────────────────────────
function friendlyError(code: string): string {
  const map: Record<string, string> = {
    "auth/invalid-email":            "Please enter a valid email address.",
    "auth/user-not-found":           "No account found with that email.",
    "auth/wrong-password":           "Incorrect password. Please try again.",
    "auth/invalid-credential":       "Invalid email or password.",
    "auth/email-already-in-use":     "An account with that email already exists.",
    "auth/weak-password":            "Password must be at least 6 characters.",
    "auth/too-many-requests":        "Too many attempts. Please wait and try again.",
    "auth/popup-closed-by-user":     "Sign-in popup was closed before completing.",
    "auth/network-request-failed":   "Network error. Check your connection.",
    "auth/user-disabled":            "This account has been disabled.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
}

// ─── Auth Panel (logged out) ──────────────────────────────────────────────────
function AuthPanel() {
  const { addToast } = useToast();
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [showCf, setShowCf]       = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const clearForm = () => { setEmail(""); setPassword(""); setConfirm(""); setError(""); };

  const switchTab = (next: "signin" | "signup") => { setTab(next); clearForm(); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (tab === "signup" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (tab === "signup" && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (tab === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
        addToast("Welcome back!", "success");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        addToast("Account created — welcome aboard!", "success");
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      addToast("Signed in with Google!", "success");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      const msg = friendlyError(code);
      if (code !== "auth/popup-closed-by-user") setError(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
          <span className="text-2xl">₿</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Welcome to TadBuy</h1>
        <p className="text-sm text-muted mt-1.5">Sign in to manage your ad campaigns and wallet.</p>
      </div>

      <Card className="glass-panel">
        {/* Tab switcher */}
        <div className="flex bg-surface rounded-xl p-1 mb-6 border border-border">
          {(["signin", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
                tab === t
                  ? "bg-accent text-black shadow-[0_2px_12px_rgba(255,159,28,0.35)]"
                  : "text-muted hover:text-text"
              }`}
            >
              {t === "signin" ? (
                <><Mail className="w-3.5 h-3.5" /> Sign In</>
              ) : (
                <><UserPlus className="w-3.5 h-3.5" /> Create Account</>
              )}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup className="mb-0">
            <Label htmlFor="auth-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <Input
                id="auth-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </FormGroup>

          <FormGroup className="mb-0">
            <Label htmlFor="auth-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <Input
                id="auth-password"
                type={showPw ? "text" : "password"}
                autoComplete={tab === "signin" ? "current-password" : "new-password"}
                placeholder={tab === "signup" ? "Min. 6 characters" : "••••••••"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </FormGroup>

          {/* Confirm password — sign-up only */}
          {tab === "signup" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <FormGroup className="mb-0">
                <Label htmlFor="auth-confirm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                  <Input
                    id="auth-confirm"
                    type={showCf ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowCf((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                    aria-label={showCf ? "Hide password" : "Show password"}
                  >
                    {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormGroup>
            </motion.div>
          )}

          {/* Error message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red bg-red/10 border border-red/20 rounded-lg px-3.5 py-2.5 font-medium"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            className="w-full gap-2 mt-2"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {tab === "signin" ? "Signing In…" : "Creating Account…"}</>
            ) : (
              tab === "signin" ? "Sign In" : "Create Account"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-bold text-muted uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google sign-in */}
        <Button
          type="button"
          variant="secondary"
          className="w-full gap-2.5"
          onClick={handleGoogle}
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          {googleLoading ? "Opening Google…" : "Continue with Google"}
        </Button>
      </Card>

      <p className="text-center text-[11px] text-muted mt-5 leading-relaxed">
        By signing in you agree to our{" "}
        <Link to="/legal/terms" className="text-accent hover:underline">Terms of Service</Link>
        {" "}and{" "}
        <Link to="/legal/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
      </p>
    </motion.div>
  );
}

// ─── Profile Card (logged in) ─────────────────────────────────────────────────
function ProfileCard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null;

  const displayName = user.displayName ?? user.email ?? "User";
  const createdAt = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "Unknown";
  const shortUid = user.uid.slice(0, 8) + "…" + user.uid.slice(-4);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut(auth);
      addToast("Signed out successfully.", "success");
    } catch {
      addToast("Failed to sign out. Please try again.", "info");
      setSigningOut(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto space-y-4"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted mt-1">Your account information and settings.</p>
      </div>

      {/* Account card */}
      <Card className="glass-panel">
        {/* Avatar + name row */}
        <div className="flex items-center gap-4 mb-6">
          <LocalAvatar seed={displayName} size={64} className="rounded-2xl border-2 border-accent/30 shadow-[0_0_20px_rgba(255,159,28,0.15)]" />
          <div className="min-w-0">
            <div className="font-extrabold text-lg leading-tight truncate">{displayName}</div>
            {user.displayName && user.email && (
              <div className="text-sm text-muted truncate">{user.email}</div>
            )}
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
              <span className="text-[11px] font-bold text-green uppercase tracking-wider">Active</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          {[
            { label: "Email", value: user.email ?? "—" },
            { label: "User ID", value: shortUid, mono: true },
            { label: "Member Since", value: createdAt },
            {
              label: "Provider",
              value: user.providerData[0]?.providerId === "google.com"
                ? "Google"
                : "Email / Password",
            },
          ].map(({ label, value, mono }) => (
            <div
              key={label}
              className="flex items-center justify-between p-3.5 bg-surface rounded-xl border border-border"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">{label}</span>
              <span className={`text-sm font-semibold truncate ml-4 max-w-[60%] text-right ${mono ? "font-mono text-xs text-accent" : ""}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Link to="/settings" className="flex-1">
          <Button variant="secondary" className="w-full gap-2">
            <Settings className="w-4 h-4" /> Settings
          </Button>
        </Link>
        <Button
          variant="secondary"
          className="flex-1 gap-2 hover:border-red hover:text-red"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          {signingOut ? "Signing Out…" : "Sign Out"}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Profile() {
  usePageTitle("Profile");
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-7 h-7 animate-spin text-accent" />
      </div>
    );
  }

  return user ? <ProfileCard /> : <AuthPanel />;
}
