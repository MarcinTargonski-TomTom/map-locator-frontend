import { type ReactNode } from "react";
import styled from "styled-components";

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
  }>;
  children: ReactNode;
  onToggleVisibility?: () => void;
}

function Tabs({
  activeTab,
  onTabChange,
  tabs,
  children,
  onToggleVisibility,
}: TabsProps) {
  return (
    <>
      <TabBar>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
        {onToggleVisibility && (
          <button
            className="toggle-button"
            onClick={onToggleVisibility}
            type="button"
            title="Hide panel"
          >
            ◀
          </button>
        )}
      </TabBar>
      <TabContent>{children}</TabContent>
    </>
  );
}

export default Tabs;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;

  .tab {
    flex: 1;
    padding: 12px 16px;
    border: none;
    background: transparent;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-size: 12px;
    font-weight: normal;
    color: #666;
    transition: all 0.2s ease;

    &:hover {
      background: #f0f0f0;
      color: #007acc;
    }

    &:first-child {
      border-radius: 8px 0 0 0;
    }

    &:last-child:not(.toggle-button) {
      border-radius: 0 8px 0 0;
    }

    &.active {
      background: white;
      border-bottom: 2px solid #007acc;
      font-weight: bold;
      color: #007acc;

      &:hover {
        background: white;
      }
    }
  }

  .toggle-button {
    flex: 0 0 auto;
    width: 40px;
    padding: 12px 8px;
    border: none;
    background: transparent;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    color: #666;
    transition: all 0.2s ease;
    border-radius: 0 8px 0 0;

    &:hover {
      background: #f0f0f0;
      color: #007acc;
    }
  }
`;

const TabContent = styled.div`
  padding: 15px;
  overflow-y: auto;
  max-height: calc(70vh - 60px);
`;
