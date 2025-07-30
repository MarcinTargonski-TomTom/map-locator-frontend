import Map from "./components/Map";
import { TombacApp } from "tombac";
import SignInPage from "./pages/SignInPage";

function App() {
  return (
    <>
      <TombacApp
        defineCssVariables
        theme={{ baseUnit: "px", settings: { modalZIndex: 20 } }}
      >
        <SignInPage />
      </TombacApp>
    </>
  );
}

export default App;
