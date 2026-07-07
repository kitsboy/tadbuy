import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui';

interface RouteErrorBoundaryProps {
  children: ReactNode;
  label?: string;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
}

export class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[RouteErrorBoundary]', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
          <AlertTriangle className="w-12 h-12 text-accent mb-4" />
          <h2 className="text-xl font-extrabold mb-2">Something went wrong</h2>
          <p className="text-sm text-muted max-w-sm mb-6">
            {this.props.label ?? 'This page'} hit an error. Try again or go home.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={this.handleRetry}>Try again</Button>
            <Link to="/"><Button variant="secondary">Go home</Button></Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}