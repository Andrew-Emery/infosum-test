import "./styles.css";
import React from "react";

interface CollapsiblePropsModel {
  title: string;
  expanded: boolean;
  children: React.ReactNode;
  extraDetail: React.ReactNode;
  onClick: () => void;
}

const Collapsible = ({
  title,
  expanded,
  children,
  extraDetail,
  onClick,
}: CollapsiblePropsModel) => {
  //Reusable component to deal with showing and hiding of drilldown.
  return (
    <div className="collapsible-container">
      <div
        onClick={onClick}
        className="collapsible-container-title"
        title={expanded ? "Collapse" : "Expand"}
      >
        <div className="collapsible-container-title-segment">
          <img
            className={`collapsible-icon ${expanded ? "expanded" : ""}`}
            src="/src/img/circle-right.svg"
          />
          {title}
        </div>
        {/* Show extra details on the right hand side, used for detailing number of keys or categories */}
        <div>{extraDetail}</div>
      </div>
      {/* When not expanded show an information filler */}
      {!expanded && (
        <div className="closed-message" onClick={onClick}>
          Click to show detailed breakdown
        </div>
      )}
      {/* Show the children when expanded is true */}
      {expanded && children}
    </div>
  );
};

export default Collapsible;
