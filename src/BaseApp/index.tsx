import "./styles.css";
import React, { useEffect, useState } from "react";
import { getDatasets } from "../api/api";
import { Dataset } from "../api/api-definition";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Home from "./HomePage";
import DatasetPage from "./DatasetPage";
import Spinner from "../common/Spinner";

export default () => {
  const [data, setData] = useState<Dataset[] | undefined>();

  useEffect(() => {
    //Fetching the 'API'
    const getData = async () => {
      const datasets = await getDatasets();
      setData(datasets);
    };

    // I wanted a loading spinner
    setTimeout(getData, 1500); //Sorry for the wait.
  }, []);

  return (
    <div className="centered-container">
      <BrowserRouter>
        <div className="infosum-logo-container">
          <Link to="/">
            {/* Just a home return on the logo */}
            <img
              className="infosum-logo"
              src="/src/img/infosum.svg"
              alt=""
              width="350px"
            />
          </Link>
        </div>
        {data === undefined && <Spinner />}
        {/* When data has not been fetched yet, displays a loading spinner component*/}
        {data !== undefined && (
          <Switch>
            <Route path="/data/:dataId">
              <DatasetPage datasets={data} />
            </Route>
            <Route path="/">
              <Home datasets={data} />
            </Route>
          </Switch>
        )}
      </BrowserRouter>
    </div>
  );
};
