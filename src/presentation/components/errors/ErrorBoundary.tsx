import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  type AppError,
  InternalServerError,
} from "@application";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorView } from "./ErrorView";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: AppError | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    let appError: AppError;

    if (
      error instanceof UnauthorizedError ||
      error instanceof ForbiddenError ||
      error instanceof NotFoundError
    ) {
      appError = error;
    } else {
      appError = new InternalServerError(error.message);
    }

    return {
      hasError: true,
      error: appError,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error capturado por Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorView error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
