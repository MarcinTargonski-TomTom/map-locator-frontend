import {
  HEATMAP_PATH,
  MAP_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
} from "./const/routes.ts";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import MapPage from "./pages/MapPage.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import { Navigate, Route, Routes } from "react-router";
import { useSessionContext } from "./context/sessionContext.tsx";
import ExtendSessionModal from "./components/ExtendSessionModal.tsx";
import HeatmapPage from "./pages/HeatmapPage.tsx";

export const AppRoutes = () => {
  const {
    role,
    showExtendSessionModal,
    handleExtendSession,
    handleCloseModal,
  } = useSessionContext();
  console.log("Current role:", role);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate replace to={MAP_PATH} />} />
        <Route
          path={MAP_PATH}
          element={
            <ProtectedElement
              element={<MapPage />}
              shouldRender={role !== null}
              redirect={SIGN_IN_PATH}
            />
          }
        />
        <Route
          path={HEATMAP_PATH}
          element={
            <ProtectedElement
              element={<HeatmapPage />}
              shouldRender={role !== null}
              redirect={SIGN_IN_PATH}
            />
          }
        />
        <Route path={SIGN_IN_PATH} element={<SignInPage />} />
        <Route path={SIGN_UP_PATH} element={<SignUpPage />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
      {showExtendSessionModal && (
        <ExtendSessionModal
          onSuccess={handleExtendSession}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

type ProtectedRouteProps = {
  element: React.ReactNode;
  shouldRender: boolean;
  redirect: string;
};

export default function ProtectedElement({
  element: Component,
  shouldRender,
  redirect,
}: ProtectedRouteProps) {
  if (shouldRender) {
    console.log("Rendering component");
  } else {
    console.log("Redirecting to", redirect);
  }
  return shouldRender ? Component : <Navigate replace to={redirect} />;
}
