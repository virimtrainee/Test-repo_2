
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Sidebar />
      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
