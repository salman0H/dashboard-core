import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

/**
 * Class-based Error Boundary (React requirement for error boundaries).
 * Catches errors from child tree — prevents full app crash.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In production: send to error tracking service here
    console.error('[ErrorBoundary]', error, info)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="p-8 text-center text-slate-500">
            <i className="ti ti-alert-triangle text-3xl text-red-400 block mb-2" aria-hidden="true" />
            <p className="font-medium text-slate-700">Something went wrong</p>
            <p className="text-xs mt-1 text-slate-400">{this.state.message}</p>
          </div>
        )
      )
    }
    return this.props.children
  }
}
