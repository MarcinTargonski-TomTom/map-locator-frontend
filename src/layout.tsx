import { AppNavbar } from "./components/Navbar.tsx";
import { ToastsProvider, TombacApp } from "tombac";
import { SessionProvider } from "./context/sessionContext.tsx";
import { AppRoutes } from "./appRoutes.tsx";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <TombacApp>
        <ToastsProvider zIndex={10}>
          <SessionProvider>
            <AppNavbar />
            <AppRoutes />
          </SessionProvider>
        </ToastsProvider>
      </TombacApp>
    </div>
  );
};

export default Layout;
