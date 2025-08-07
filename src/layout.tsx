import { Navigate, Route, Routes } from "react-router";
import { AppNavbar } from "./components/Navbar.tsx";
import MapPage from "./pages/MapPage.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import { ToastsProvider, TombacApp } from "tombac";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import { SessionProvider } from "./context/sessionContext.tsx";
import { MAP_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from "./const/routes.ts";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <TombacApp>
        <ToastsProvider zIndex={10}>
          <SessionProvider>
            <AppNavbar />
            <Routes>
              <Route
                path="/"
                element={<Navigate replace to={SIGN_IN_PATH} />}
              />
              <Route path={MAP_PATH} element={<MapPage />} />
              <Route path={SIGN_IN_PATH} element={<SignInPage />} />
              <Route path={SIGN_UP_PATH} element={<SignUpPage />} />
              <Route path="/*" element={<PageNotFound />} />
            </Routes>
          </SessionProvider>
        </ToastsProvider>
      </TombacApp>
    </div>
  );
};

export default Layout;
