import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-12 max-w-md mx-auto">
          <p className="text-8xl font-bold text-[#cf6b47] mb-4 tracking-tight">
            404
          </p>
          <h1 className="text-2xl font-semibold text-stone-100 mb-3">Page Not Found</h1>
          <p className="text-stone-400 mb-8 text-sm">
            The page{" "}
            <code className="text-stone-300 bg-stone-800 px-1.5 py-0.5 rounded text-sm">
              {location.pathname}
            </code>{" "}
            doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-700 text-stone-300 hover:border-stone-600 hover:text-stone-100 rounded-full transition-all duration-150 font-medium text-sm"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
