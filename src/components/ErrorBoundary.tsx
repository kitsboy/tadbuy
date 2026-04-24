import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#18181b] p-8">
          <div className="max-w-md w-full bg-[#202024] border border-[#3f3f46] rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-red/10 border border-red/30 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-7 h-7 text-red" />
            </div>
            <h1 className="text-xl font-extrabold text-white mb-2 tracking-tight">
              Something went wrong
            </h1>
            <p className="text-sm text-[#a1a1aa] mb-6 leading-relaxed">
              An unexpected error occurred. The incident has been logged. Please reload and try again.
            </p>
            {this.state.error?.message && (
              <div className="bg-[#18181b] border border-[#3f3f46] rounded-lg p-3 font-mono text-xs text-red mb-6 text-left break-all leading-relaxed">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-[#ff9f1c] text-black font-bold px-6 py-2.5 rounded-lg hover:bg-[#ff9f20] transition-colors shadow-[0_4px_14px_0_rgba(247,147,26,0.39)]"
            >
              <RefreshCw className="w-4 h-4" />
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
