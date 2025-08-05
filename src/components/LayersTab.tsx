import { useContext } from "react";
import { MapContext } from "../context/mapContext";

function LayersTab() {
  const { regions, responseIndex, setRegions } = useContext(MapContext);

  const region = regions ? regions[responseIndex] : null;

  return (
    <>
      {regions &&
        region?.requestRegions
          .sort((a, b) => a.pointOfInterest.order - b.pointOfInterest.order)
          .map((reqRegion, index) => (
            <div key={index}>
              <h3>{reqRegion.pointOfInterest.name}</h3>
              <button
                onClick={() =>
                  setRegions(
                    regions.map((r, i) =>
                      i === responseIndex
                        ? {
                            ...r,
                            requestRegions: r.requestRegions.map((rr, j) =>
                              j === index
                                ? {
                                    ...rr,
                                    pointOfInterest: {
                                      ...rr.pointOfInterest,
                                      isDisplayed:
                                        !rr.pointOfInterest.isDisplayed,
                                    },
                                  }
                                : rr
                            ),
                          }
                        : r
                    )
                  )
                }
              >
                Oko
              </button>
              <button
                onClick={() =>
                  setRegions(
                    regions.map((r, i) =>
                      i === responseIndex
                        ? {
                            ...r,
                            requestRegions: r.requestRegions.map((rr, j) =>
                              j === index
                                ? {
                                    ...rr,
                                    pointOfInterest: {
                                      ...rr.pointOfInterest,
                                      order: rr.pointOfInterest.order - 1,
                                    },
                                  }
                                : rr
                            ),
                          }
                        : r
                    )
                  )
                }
              >
                ^
              </button>
              {reqRegion.pointOfInterest.order}
              <button
                onClick={() =>
                  setRegions(
                    regions.map((r, i) =>
                      i === responseIndex
                        ? {
                            ...r,
                            requestRegions: r.requestRegions.map((rr, j) =>
                              j === index
                                ? {
                                    ...rr,
                                    pointOfInterest: {
                                      ...rr.pointOfInterest,
                                      order: rr.pointOfInterest.order + 1,
                                    },
                                  }
                                : rr
                            ),
                          }
                        : r
                    )
                  )
                }
              >
                V
              </button>
            </div>
          ))}
    </>
  );
}

export default LayersTab;
