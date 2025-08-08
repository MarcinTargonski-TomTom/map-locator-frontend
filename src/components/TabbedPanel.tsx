import { useState } from "react";
import { Box } from "tombac";
import styled from "styled-components";
import Tabs from "./Tabs";
import SearchTab from "./SearchTab";
import ResponsesTab from "./ResponsesTab";
import LayersTab from "./LayersTab";

type TabType = "search" | "responses" | "layers";

interface TabbedPanelProps {
  onToggleVisibility?: () => void;
}

function TabbedPanel({ onToggleVisibility }: TabbedPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("search");

  const renderTabContent = () => {
    switch (activeTab) {
      case "search":
        return <SearchTab />;
      case "responses":
        return <ResponsesTab />;
      case "layers":
        return <LayersTab />;
      default:
        return null;
    }
  };

  const tabs = [
    { id: "search", label: "Search" },
    { id: "responses", label: "Responses" },
    { id: "layers", label: "Layers" },
  ];

  return (
    <Box as={Panel}>
      <Tabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
        tabs={tabs}
        onToggleVisibility={onToggleVisibility}
      >
        {renderTabContent()}
      </Tabs>
    </Box>
  );
}

export default TabbedPanel;

const Panel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 400px;
  max-height: 70vh;
  font-size: 14px;
  overflow: hidden;
`;
