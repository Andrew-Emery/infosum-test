import "./styles.css";
import React, { useState } from "react";
import { Category } from "../../../api/api-definition";
import { calculateDistinctRows, formatNumber } from "../../../common/utils";
import { Link, useLocation } from "react-router-dom";

interface CategoryRowPropsModel {
  datasetId: string;
  dataKey: Category;
  rowCount: number;
  rowIndex: number;
}

const CategoryRow = ({
  datasetId,
  rowCount,
  dataKey,
  rowIndex,
}: CategoryRowPropsModel) => {
  const { search } = useLocation(); // Takes the query from the URL.
  const query = new URLSearchParams(search); //Enables utilities from the retreived search.
  query.set("categoryId", dataKey.id);
  const linkUrl = `/data/${datasetId}?${query.toString()}`;

  const [hovered, setHovered] = useState(false); //State to moniter whether the categories in the overview table are hovered.
  const events = {
    // Events for each cell rather than repeating
    onMouseOver: () => setHovered(true),
    onMouseOut: () => setHovered(false),
  };
  const numNull = Math.round(
    dataKey.best_representation.statistics.null_fraction * rowCount
  );
  const numDistinct = Math.round(
    calculateDistinctRows(
      rowCount,
      dataKey.best_representation.statistics.distinct
    )
  );
  const numDuplicate = rowCount - (numNull + numDistinct);

  const oddStyle = rowIndex % 2 === 1 ? "odd-row" : "even-row";
  const rowStyle = `${oddStyle} ${hovered ? "hovered-row" : ""}`;

  const getPercent = (rows) => ((rows / rowCount) * 100).toFixed(2);
  return (
    <>
      <Link className="link-cell" to={linkUrl}>
        <div className={`cell ${rowStyle}`} {...events}>
          {dataKey.name}
        </div>
      </Link>
      <Link className="link-cell" to={linkUrl}>
        <div className={`cell ${rowStyle}`} {...events}>
          {dataKey.best_representation.representation_name}
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

export default CategoryRow;
