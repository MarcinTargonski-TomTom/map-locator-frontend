import styled from "styled-components";
import HeatmapMap from "../components/HeatmapMap";

function HeatmapPage() {
  return (
    <Container>
      <HeatmapMap />
    </Container>
  );
}

export default HeatmapPage;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
