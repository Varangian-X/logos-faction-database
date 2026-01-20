import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to session storage for debugging
    const errorLog = JSON.parse(sessionStorage.getItem('errorLog') || '[]');
    errorLog.push({
      timestamp: new Date().toISOString(),
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      gameStateId: sessionStorage.getItem('currentGameId')
    });
    sessionStorage.setItem('errorLog', JSON.stringify(errorLog.slice(-10))); // Keep last 10 errors
    
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full bg-slate-900 border-red-500/50">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Session Error Detected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-gray-300 mb-2">
                  The game encountered an error. Your progress should be saved via auto-save.
                </p>
                <details className="text-xs text-gray-500 mt-2">
                  <summary className="cursor-pointer hover:text-gray-400">Error Details</summary>
                  <pre className="mt-2 overflow-auto max-h-64 bg-slate-950 p-2 rounded">
                    {this.state.error?.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={this.handleReset} className="bg-cyan-600 hover:bg-cyan-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Game
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const log = sessionStorage.getItem('errorLog');
                    navigator.clipboard.writeText(log || 'No errors logged');
                  }}
                >
                  Copy Error Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;