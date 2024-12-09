import React from 'react';
import { Card, Button } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-danger mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-small text-default-500 mb-4">
            {/* {this.state.error?.message} */}
          </p>
          <Button
            color="primary"
            onPress={() => window.location.reload()}
          >
            Reload Application
          </Button>
        </Card>
      );
    }
    return this.props.children;
  }
}