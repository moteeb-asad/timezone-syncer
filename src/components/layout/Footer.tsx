import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Timezone Syncer. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/about"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/premium"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              Premium
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
