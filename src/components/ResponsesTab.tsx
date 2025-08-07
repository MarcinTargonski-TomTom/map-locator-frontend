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
          marginBottom: "2px",
          padding: "3px",
          borderRadius: "5px",
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
          border: index === responseIndex ? "2px solid #de1c12" : "none",
          background: index === responseIndex ? "#ff7875" : "#FFFFFF",
        }}
      >
        <h3>Region {index + 1}</h3>
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
