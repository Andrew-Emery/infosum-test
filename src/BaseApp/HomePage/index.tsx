import "./styles.css";
import React, { useState } from "react";
import { Dataset } from "../../api/api-definition";
import Button from "../../common/Button";
import DatasetPill from "./DatasetPill";

interface HomePropsModel {
  datasets: Dataset[];
}

const Home = ({ datasets }: HomePropsModel) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const filteredDatasets = datasets.filter((dataset) =>
    dataset.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  );
  return (
    <div className="home-content">
      <div id="search-container">
        <input
          type="text"
          id="home-search"
          placeholder="Search by dataset name"
          value={searchTerm}
          onChange={(evt) => {
            setSearchTerm(evt.target.value);
          }}
        />
        <Button text="Search" onClick={() => {}} onHover={() => {}} />
      </div>
      {filteredDatasets.map((singleDataset) => {
        return <DatasetPill dataset={singleDataset} />;
      })}
      {/* Just a displayed message for when the filter returns an array with a length of 0 */}
      {filteredDatasets.length === 0 && (
        <div className="no-data-message">
          No datasets found matching your search term.
        </div>
      )}
    </div>
  );
};

export default Home;
