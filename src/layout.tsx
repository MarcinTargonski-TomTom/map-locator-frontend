import { Route, Routes } from "react-router";
import { AppNavbar } from "./components/Navbar.tsx";
import MapPage from "./pages/MapPage.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import { ToastsProvider, TombacApp } from "tombac";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <TombacApp>
        <ToastsProvider zIndex={10}>
          <AppNavbar />
          <Routes>
            <Route path="/map" element={<MapPage />} />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </ToastsProvider>
      </TombacApp>
    </div>
  );
};

export default Layout;
