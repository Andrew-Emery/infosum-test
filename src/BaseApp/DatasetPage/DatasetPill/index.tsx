import "./styles.css";
import React, { useState } from "react";
import { Key } from "../../../api/api-definition";
import { calculateDistinctRows, formatNumber } from "../../../common/utils";
import { Link, useLocation } from "react-router-dom";

interface KeyPillPropsModel {
  datasetId: string;
  dataKey: Key;
  rowCount: number;
  rowIndex: number;
}

const KeyPill = ({
  datasetId,
  rowCount,
  dataKey,
  rowIndex,
}: KeyPillPropsModel) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  query.set("keyId", dataKey.id);
  const linkUrl = `/data/${datasetId}?${query.toString()}`;

  const [hovered, setHovered] = useState(false); //State to moniter whether the keys in the overview table are hovered.
  const events = {
    onMouseOver: () => setHovered(true),
    onMouseOut: () => setHovered(false),
  };
  const numNull = Math.round(dataKey.null_fraction * rowCount);
  const numDistinct = Math.round(
    calculateDistinctRows(rowCount, dataKey.distinct)
  );
  const numDuplicate = rowCount - (numNull + numDistinct);

  const oddStyle = rowIndex % 2 === 1 ? "odd-row" : "even-row";
  const rowStyle = `${oddStyle} ${hovered ? "hovered-row" : ""}`;

  const getPercent = (rows) => ((rows / rowCount) * 100).toFixed(2);
  return (
    // Because I used display grid to style I needed these to act like cells in the grid, rather than rows so <></> is ignored when on the page and allows the children to be styled by grid
    <>
      <Link className="link-cell" to={linkUrl}>
        <div className={`cell ${rowStyle}`} {...events}>
          {dataKey.label}
        </div>
      </Link>
      <Link className="link-cell" to={linkUrl}>
        <div className={`cell number-cell ${rowStyle}`} {...events}>
          {formatNumber(numNull)} ({getPercent(numNull)}%)
        </div>
      </Link>
      <Link className="link-cell" to={linkUrl}>
        <div className={`cell number-cell ${rowStyle}`} {...events}>
          {formatNumber(numDistinct)} ({getPercent(numDistinct)}%)
        </div>
      </Link>
      <Link className="link-cell" to={linkUrl}>
        <div className={`cell number-cell ${rowStyle}`} {...events}>
          {formatNumber(numDuplicate)} ({getPercent(numDuplicate)}%)
        </div>
      </Link>
    </>
  );
};

export default KeyPill;
