import { useEffect, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DarkModeToggle from "./components/DarkModeToggle";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col custom-scrollbar">
        <DarkModeToggle />
        <Navbar navigate={navigate} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {route === "/" && <Home navigate={navigate} />}
          {route.startsWith("/product/") && (
            <ProductDetail productId={route.split("/")[2]} />
          )}
          {route === "/cart" && <Cart />}
          {route === "/profile" && <Profile />}
          
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}


