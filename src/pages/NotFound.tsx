
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="py-2 px-4 inline-block bg-destructive/10 text-destructive rounded-full text-sm font-medium mb-6">
          Error 404
        </div>
        <h1 className="text-4xl font-bold mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center px-5 py-3
                   font-medium rounded-lg transition-all duration-200
                   bg-primary text-primary-foreground
                   hover:bg-primary/90 focus:outline-none focus:ring-2 
                   focus:ring-primary/50 focus:ring-offset-2"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
