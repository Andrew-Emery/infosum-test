import "./styles.css";
import React from "react";
import { Dataset } from "../../../api/api-definition";
import { format, formatDistance } from "date-fns";
import { Link } from "react-router-dom";
import { formatNumericString } from "../../../common/utils";

interface DatasetPillPropsModel {
  dataset: Dataset;
}

const DatasetPill = ({ dataset }: DatasetPillPropsModel) => {
  const created = new Date(dataset.created_at);
  const formattedCreated = format(created, "dd/MM/yyyy");
  const lastEdited = new Date(dataset.updated_at);
  const formattedLastEdited = formatDistance(lastEdited, new Date(), {
    addSuffix: true,
  });
  const rows = dataset.stats.row_count;
  const formattedRows = formatNumericString(rows);
  const keys = dataset.stats.keys.length;
  const categories = dataset.stats.categories.length;

  return (
    <Link className="dataset-pill-link" to={`/data/${dataset.dataset_id}`}>
      <div className="dataset-pill-container">
        <div className="dataset-pill-content">
          <div className="dataset-pill-header">
            Dataset name: {dataset.name}
          </div>

          <div className="dataset-pill-footer">
            <div className="search-list-text">
              <img className="search-list-icon" src="/src/img/key.svg" />
              <div>
                {keys} {keys === 1 ? "key" : "keys"}
              </div>
            </div>
            <div className="search-list-text">
              <img
                className="search-list-icon bigger-icon"
                src="/src/img/books.svg"
              />
              <div>
                {categories} {categories === 1 ? "category" : "categories"}
              </div>
            </div>
            <div className="search-list-text">
              <img
                className="search-list-icon"
                src="/src/img/list-numbered.svg"
              />
              <div>
                {formattedRows} {Number(rows) === 1 ? "row" : "rows"}
              </div>
            </div>
            <div className="search-list-text">
              <img className="search-list-icon" src="/src/img/calendar.svg" />
              <div>
                <div>Created:</div>
                <div>{formattedCreated}</div>
              </div>
            </div>
            <div className="search-list-text">
              <img className="search-list-icon" src="/src/img/pencil.svg" />
              <div>
                <div>Modified:</div>
                <div>{formattedLastEdited}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DatasetPill;
