import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ExternalLink } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Link Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The short link you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/" target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              Create New Link
            </Link>
          </Button>
        </div>
        
        <div className="pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            If you believe this is an error, please contact the link creator.
          </p>
        </div>
      </div>
    </div>
  );
}
