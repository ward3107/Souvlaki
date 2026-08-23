import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Rendered instead of the default card when a child throws. */
  fallback?: ReactNode;
  /** Optional label to identify which region failed, for logging. */
  region?: string;
}

interface State {
  hasError: boolean;
}

// Catches render/runtime errors in a subtree so one failed lazy chunk or a
// buggy section can't blank the whole page. The homepage keeps rendering; only
// the broken region is replaced with a friendly, retryable message.
export default class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep a breadcrumb in the console; avoid noisy UI. A real logging sink can
    // hook in here later.
    console.error(
      `[ErrorBoundary${this.props.region ? `:${this.props.region}` : ''}]`,
      error,
      info
    );
  }

  handleRetry = () => this.setState({ hasError: false });

  override render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;

    // Language-neutral default so it works regardless of where it's mounted.
    return (
      <div
        role="alert"
        className="mx-auto my-8 max-w-md rounded-2xl border border-black/5 bg-white p-6 text-center shadow-soft dark:border-white/10 dark:bg-slate-800"
      >
        <p className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
          Something went wrong here
        </p>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          משהו השתבש · حدث خطأ ما · Что-то пошло не так
        </p>
        <button
          type="button"
          onClick={this.handleRetry}
          className="inline-flex items-center justify-center rounded-full bg-brand-terracotta-400 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-terracotta-500 active:scale-95"
        >
          Try again
        </button>
      </div>
    );
  }
}
