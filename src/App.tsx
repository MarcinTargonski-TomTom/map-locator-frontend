import Map from "./components/Map";
import { TombacApp } from "tombac";

function App() {
  return (
    <>
      <TombacApp
        defineCssVariables
        theme={{ baseUnit: "px", settings: { modalZIndex: 20 } }}
      >
        <Map />
      </TombacApp>
    </>
  );
}

export default App;
