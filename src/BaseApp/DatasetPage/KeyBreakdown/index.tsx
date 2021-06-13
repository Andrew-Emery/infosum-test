import "./styles.css";
import React from "react";
import { calculateDistinctRows, formatNumber } from "../../../common/utils";
import { Dataset } from "../../../api/api-definition";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Link, useLocation } from "react-router-dom";

interface KeyBreakdownPropsModel {
  dataset: Dataset;
}

const barChart: Highcharts.Options = {
  //Again, moved alot of the chart options up here to try to tidy the code below.
  chart: {
    type: "column",
  },
  yAxis: {
    min: 0,
    title: {
      text: "Number of rows",
    },
  },
  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.0f} rows</b></td></tr>',
    footerFormat: "</table>",
    shared: true,
    useHTML: true,
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    },
  },
};

const pieChart: Highcharts.Options = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: "pie",
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
  },
  accessibility: {
    point: {
      valueSuffix: "%",
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.percentage:.1f} %",
      },
      colors: ["#6cace4", "#f68d2e", "#009739"], //Defined colour pallette to match pills above chart
    },
  },
};

export default ({ dataset }: KeyBreakdownPropsModel) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const keyId = query.get("keyId");
  const rowCount = Number(dataset.stats.row_count);
  if (!keyId) {
    const data = dataset.stats.keys.map((key) => {
      // Copied component to be same as categories.
      const nulled = key.null_fraction * rowCount;
      const distinct = calculateDistinctRows(rowCount, key.distinct);
      const duplicate = rowCount - (nulled + distinct);
      return {
        label: key.label,
        null: nulled,
        distinct: distinct,
        duplicate: duplicate,
      };
    });
    const chartOptions: Highcharts.Options = {
      ...barChart,
      title: {
        text: dataset.name,
      },
      xAxis: {
        categories: data.map((item) => item.label),
        crosshair: true,
      },
      series: [
        {
          name: "Null",
          type: "column",
          data: data.map((item) => item.null),
          color: "#6cace4",
        },
        {
          name: "Duplicate",
          type: "column",
          data: data.map((item) => item.duplicate),
          color: "#f68d2e",
        },
        {
          name: "Distinct",
          type: "column",
          data: data.map((item) => item.distinct),
          color: "#009739",
        },
      ],
    };
    return (
      <div className="key-breakdown-box">
        <div className="pill-container">
          <span className="pill purple">
            {formatNumber(rowCount)} total {rowCount === 1 ? "row" : "rows"}
          </span>
          <div className="drilldown-message">
            Select a key from the above table to see further breakdowns.
          </div>
        </div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    );
  }
  const dataKey = dataset.stats.keys.find((item) => item.id === keyId);
  const numNull = Math.round(dataKey.null_fraction * rowCount);
  const numDistinct = Math.round(
    calculateDistinctRows(rowCount, dataKey.distinct)
  );
  const numDuplicate = rowCount - (numNull + numDistinct);

  const chartOptions = {
    ...pieChart,
    title: {
      text: dataKey.label,
    },
    series: [
      {
        name: "Data accuracy breakdown",
        colorByPoint: true,
        type: "pie",
        data: [
          {
            name: "Null",
            y: numNull,
            selected: true,
          },
          {
            name: "Duplicate",
            y: numDuplicate,
          },
          {
            name: "Distinct",
            y: numDistinct,
          },
        ],
      },
    ],
  };

  query.delete("keyId");
  return (
    <div className="key-breakdown-box">
      <div className="pill-container" style={{ marginTop: "5px" }}>
        <div>
          <Link
            className="back-link pill"
            to={`/data/${dataset.dataset_id}?${query.toString()}`}
          >
            Back to overview
          </Link>
          <span className="pill purple">
            {formatNumber(rowCount)} total {rowCount === 1 ? "row" : "rows"}
          </span>
        </div>
        <div>
          <span className="pill blue">
            {formatNumber(numNull)} null {numNull === 1 ? "row" : "rows"}
          </span>
          <span className="pill green">
            {formatNumber(numDistinct)} distinct{" "}
            {numDistinct === 1 ? "row" : "rows"}
          </span>
          <span className="pill orange">
            {formatNumber(numDuplicate)} duplicate{" "}
            {numDuplicate === 1 ? "row" : "rows"}
          </span>
        </div>
      </div>
      <div className="chart-container">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};
