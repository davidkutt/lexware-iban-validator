import { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardHeader, CardBody, Button, Icon } from './ui';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full animate-fade-in">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-red-500">Ein Fehler ist aufgetreten</h2>
                </CardHeader>

                <CardBody className="space-y-3">
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
                      Fehlermeldung
                    </h3>
                    <p className="text-red-800 font-mono text-sm bg-white p-3 rounded-lg border border-red-200">
                      {this.state.error?.message || 'Unbekannter Fehler'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={this.handleReload}
                        icon={<Icon name="refresh" size={20} />}
                        fullWidth
                    >
                      Seite neu laden
                    </Button>
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={this.handleReset}
                        icon={<Icon name="close" size={20} />}
                        fullWidth
                    >
                      Fehler ignorieren
                    </Button>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Icon name="info" size={16} />
                      Was Sie tun können:
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600 mt-0.5">•</span>
                        <span>Laden Sie die Seite neu, um es erneut zu versuchen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600 mt-0.5">•</span>
                        <span>Löschen Sie den Browser-Cache und Cookies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600 mt-0.5">•</span>
                        <span>Überprüfen Sie Ihre Internetverbindung</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary-600 mt-0.5">•</span>
                        <span>Kontaktieren Sie den Support, falls das Problem weiterhin besteht</span>
                      </li>
                    </ul>
                  </div>

                  {import.meta.env.DEV && this.state.errorInfo && (
                      <details className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-auto">
                        <summary className="cursor-pointer font-semibold mb-2 text-gray-300 hover:text-white">
                          Technische Details (Development Only)
                        </summary>
                        <div className="space-y-4 mt-4">
                          <div>
                            <p className="text-red-400 font-semibold mb-1">Error Stack:</p>
                            <pre className="whitespace-pre-wrap text-gray-300 bg-gray-800 p-3 rounded">
                          {this.state.error?.stack}
                        </pre>
                          </div>
                          <div>
                            <p className="text-yellow-400 font-semibold mb-1">Component Stack:</p>
                            <pre className="whitespace-pre-wrap text-gray-300 bg-gray-800 p-3 rounded">
                          {this.state.errorInfo.componentStack}
                        </pre>
                          </div>
                        </div>
                      </details>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
