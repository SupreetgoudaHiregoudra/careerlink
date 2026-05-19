import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });

    console.error(
      "CareerLink ErrorBoundary caught an error:",
      error,
      errorInfo
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl">
            
            {/* Header */}
            <div className="border-b border-white/10 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
                  <AlertTriangle size={30} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Oops! Something went wrong
                  </h1>

                  <p className="mt-1 text-sm text-slate-300">
                    CareerLink encountered an unexpected error.
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6">
              <div className="rounded-2xl border border-rose-500/20 bg-black/30 p-5">
                <p className="text-sm font-medium text-rose-300 mb-3">
                  Error Details
                </p>

                <div className="max-h-72 overflow-auto rounded-xl bg-black/40 p-4 text-sm text-slate-300">
                  <pre className="whitespace-pre-wrap break-words">
                    {this.state.error &&
                      this.state.error.toString()}

                    {"\n\n"}

                    {this.state.errorInfo &&
                      this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={this.handleReload}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  <RefreshCcw size={16} />
                  Reload Application
                </button>

                <button
                  onClick={() => window.history.back()}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;