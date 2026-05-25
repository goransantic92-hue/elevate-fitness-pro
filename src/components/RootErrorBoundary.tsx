import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class RootErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App render error:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    const isChunk =
      this.state.error.name === "ChunkLoadError" ||
      /Failed to fetch dynamically imported module|Loading chunk|Importing a module script failed/i.test(
        this.state.error.message,
      );

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="font-display text-2xl text-foreground">Something went wrong</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isChunk
              ? "The app was updated. Reload once to load the latest version."
              : "An unexpected error occurred. Try reloading the page."}
          </p>
          <Button
            type="button"
            className="bg-primary text-primary-foreground font-bold"
            onClick={() => window.location.reload()}
          >
            Reload page
          </Button>
        </div>
      </div>
    );
  }
}
