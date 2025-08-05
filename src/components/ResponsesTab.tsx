import { useContext } from "react";
import { MapContext } from "../context/mapContext";

function ResponsesTab() {
  const { regions, setResponseIndex, responseIndex } = useContext(MapContext);

  return regions && regions.length > 0 ? (
    regions.map((region, index) => (
      <div
        key={index}
        onClick={() => setResponseIndex(index)}
        style={{
          cursor: "pointer",
          marginBottom: "10px",
          background: index === responseIndex ? "#ffcccc" : "#FFFFFF",
        }}
      >
        <h3>Region {index + 1}</h3>
        <p>{region.responseRegion.center?.latitude}</p>
        <p>{region.responseRegion.center?.longitude}</p>
        <ul>
          {region.requestRegions.map((reqRegion, reqIndex) => (
            <li key={reqIndex}>{reqRegion.pointOfInterest.name}</li>
          ))}
        </ul>
      </div>
    ))
  ) : (
    <>
      <p>Brak odpowiedzi</p>
    </>
  );
}

export default ResponsesTab;
