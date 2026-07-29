import { Outlet } from "react-router-dom";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";

function UserLayout() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col relative overflow-hidden selection:bg-purple-600 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default UserLayout;