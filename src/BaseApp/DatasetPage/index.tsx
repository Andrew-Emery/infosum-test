import "./styles.css";
import React, { useState } from "react";
import { Dataset } from "../../api/api-definition";
import { useParams, useLocation, Link } from "react-router-dom";
import KeyPill from "./DatasetPill";
import KeyBreakdown from "./KeyBreakdown";
import CategoryRow from "./CategoryRow";
import Collapsible from "../../common/Collapsible";
import CategoryBreakdown from "./CategoryBreakdown";

interface DatasetPropsModel {
  datasets: Dataset[];
}

const DatasetComponent = ({ datasets }: DatasetPropsModel) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const [keysExpanded, setKeysExpanded] = useState(query.has("keyId"));
  const [categoriesExpanded, setCategoriesExpanded] = useState(
    query.has("categoryId")
  );
  const { dataId } = useParams(); // Gets the dataId segement out of the path

  const dataset = datasets.find((item) => item.dataset_id === dataId);
  if (!dataset) {
    return <div>404 - Resource could not be found.</div>;
  }

  const rowCount = Number(dataset.stats.row_count);
  return (
    <div className="dataset-container">
      <div className="dataset-content">
        <div className="page-tree">
          <Link className="page-tree-link" to="/">
            Homepage
          </Link>
          &nbsp;/&nbsp;
          <Link className="page-tree-link" to={`/data/${dataset.dataset_id}`}>
            {dataset.name}
          </Link>
        </div>
        <Collapsible
          title="Keys"
          expanded={keysExpanded}
          extraDetail={
            <div className="extra-collapse-content">
              <img
                src="/src/img/key.svg"
                className="extra-collapse-content-icon-small"
              />
              {dataset.stats.keys.length}{" "}
              {dataset.stats.keys.length === 1 ? "key" : "keys"}
            </div>
          }
          onClick={() => setKeysExpanded(!keysExpanded)}
        >
          <div className="dataset-content-box">
            <div className="dataset-grid">
              <div className="grid-head">Label</div>
              <div className="grid-head">Null rows</div>
              <div className="grid-head">Distinct rows</div>
              <div className="grid-head">Duplicate rows</div>
              {dataset.stats.keys.map((key, idx) => (
                <KeyPill
                  datasetId={dataset.dataset_id}
                  dataKey={key}
                  rowCount={rowCount}
                  rowIndex={idx}
                />
              ))}
            </div>
            {dataset.stats.keys.length === 0 && (
              <div className="no-keys-message">
                No keys associated with this dataset.
              </div>
            )}
          </div>
          {dataset.stats.keys.length > 0 && (
            // Had to give these keys to force the component to refresh when the key was changed, as highcharts was acting strange.
            <KeyBreakdown dataset={dataset} key={query.get("keyId")} />
          )}
        </Collapsible>
        <Collapsible
          title="Categories"
          expanded={categoriesExpanded}
          extraDetail={
            <div className="extra-collapse-content">
              <img
                src="/src/img/books.svg"
                className="extra-collapse-content-icon"
              />
              {dataset.stats.categories.length}{" "}
              {dataset.stats.categories.length === 1
                ? "category"
                : "categories"}
            </div>
          }
          onClick={() => setCategoriesExpanded(!categoriesExpanded)}
        >
          <div className="dataset-content-box">
            <div className="dataset-grid-categories">
              <div className="grid-head">Category</div>
              <div className="grid-head">Best ID</div>
              <div className="grid-head">Null rows</div>
              <div className="grid-head">Distinct rows</div>
              <div className="grid-head">Duplicate rows</div>
              {dataset.stats.categories.map((key, idx) => (
                <CategoryRow
                  datasetId={dataset.dataset_id}
                  dataKey={key}
                  rowCount={rowCount}
                  rowIndex={idx}
                />
              ))}
            </div>
            {dataset.stats.categories.length === 0 && (
              <div className="no-keys-message">
                No categories associated with this dataset.
              </div>
            )}
          </div>
          {dataset.stats.categories.length > 0 && (
            <CategoryBreakdown
              dataset={dataset}
              key={query.get("categoryId")}
            />
          )}
        </Collapsible>
      </div>
    </div>
  );
};

export default DatasetComponent;
