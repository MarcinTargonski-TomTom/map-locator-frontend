import styled from "styled-components";
import { Box, Heading } from "tombac";
import Tabs from "./Tabs";
import { useContext, useState } from "react";
import type { ApiResponse, PointOfInterestDTO } from "../types/api";
import { MapContext } from "../context/mapContext";
import { ensureColorsAssigned } from "../utils/colorUtils";

type TabType = "Location matches";

interface LocationMatchesListProps {
  matches: ApiResponse[];
  onToggleVisibility?: () => void;
}

function LocationMatchesList({
  matches,
  onToggleVisibility,
}: LocationMatchesListProps) {
  const { setRegions } = useContext(MapContext);
  const [activeTab, setActiveTab] = useState<TabType>("Location matches");
  const tabs = [
    { id: "Location matches", label: `${matches.length} matches found` },
  ];

  const handleLocationSelect = (selectedMatch: ApiResponse) => {
    console.log("Selected location:", selectedMatch);

    const coloredPoints: PointOfInterestDTO[] = ensureColorsAssigned(
      selectedMatch.requestRegions.map((region) => region.pointOfInterest)
    );

    const processedLocationMatch: ApiResponse = {
      name: selectedMatch.name,
      responseRegion: selectedMatch.responseRegion,
      requestRegions:
        selectedMatch.requestRegions?.map((reqRegion, index) => {
          return {
            ...reqRegion,
            pointOfInterest: {
              ...coloredPoints[index], // Use coloredPoints instead of pointsWithColors
              isDisplayed: true,
              order: index,
            },
          };
        }) || [],
    };

    setRegions([processedLocationMatch]);
  };

  if (!matches || matches.length === 0) {
    return (
      <Box as={Panel}>
        <Heading level={4} $margin="1sp">
          Location Matches
        </Heading>
        <Heading level={5} $margin="1sp">
          No location matches found
        </Heading>
      </Box>
    );
  }

  return (
    <Box as={Panel}>
      <Tabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
        tabs={tabs}
        onToggleVisibility={onToggleVisibility}
      >
        {
          <ScrollableList>
            {matches.map((match, index) => (
              <LocationItem
                key={index}
                level={5}
                $margin="1sp"
                onClick={() => handleLocationSelect(match)}
              >
                {match.name}
              </LocationItem>
            ))}
          </ScrollableList>
        }
      </Tabs>
    </Box>
  );
}

export default LocationMatchesList;

const Panel = styled.div`
  position: absolute;
  top: 60px;
  left: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 400px;
  height: 40vh;
  font-size: 14px;
  overflow: hidden;
`;

const ScrollableList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  height: 100vh;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const LocationItem = styled(Heading)`
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;
