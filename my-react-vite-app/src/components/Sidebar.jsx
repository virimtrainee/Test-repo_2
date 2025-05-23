
import { Home, LayoutDashboard, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 border-r bg-white h-full fixed left-0 top-16">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
