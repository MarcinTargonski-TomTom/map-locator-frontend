import { useContext } from "react";
import { MapContext } from "../context/mapContext";
import { Button } from "tombac";

const SelectResponseForm = () => {
  const { regions, responseIndex, setResponseIndex } = useContext(MapContext);

  return regions !== null && regions.length > 0 ? (
    <>
      <Button
        onClick={() => {
          if (responseIndex < regions.length - 1) {
            setResponseIndex(responseIndex + 1);
          }
        }}
      >
        Next Region
      </Button>
      <Button
        onClick={() => {
          if (responseIndex > 0) {
            setResponseIndex(responseIndex - 1);
          }
        }}
      >
        Previous Region
      </Button>
    </>
  ) : (
    <></>
  );
};

export default SelectResponseForm;
