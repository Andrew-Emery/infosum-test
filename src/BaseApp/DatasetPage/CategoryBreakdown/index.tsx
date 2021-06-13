import "./styles.css";
import React from "react";
import { calculateDistinctRows, formatNumber } from "../../../common/utils";
import { Dataset } from "../../../api/api-definition";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsDrilldown from "highcharts/modules/drilldown";
import { Link, useLocation } from "react-router-dom";

HighchartsDrilldown(Highcharts); // Was required to enable the drilldown Solution found here(https://www.highcharts.com/forum/viewtopic.php?t=39449).
interface KeyBreakdownPropsModel {
  dataset: Dataset;
}

const barChart: Highcharts.Options = {
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
  //Created a const to hold some chart options to keep below code tidier, didn't work but helped.
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
    item: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.percentage:.1f} %",
      },
    },
  },
};

export default ({ dataset }: KeyBreakdownPropsModel) => {
  const { search } = useLocation(); // Found a way to get the query from the URL (https://reactrouter.com/web/api/Hooks/uselocation).
  const query = new URLSearchParams(search); // URLSearchParams creates a utility to work with the search part of the URL.
  const categoryId = query.get("categoryId"); // Returns the value of the query and pops it in a const.

  const rowCount = Number(dataset.stats.row_count);

  if (!categoryId) {
    // If no key is selected from the table, shows an overview bar chart comparing the datasets.
    const data = dataset.stats.categories.map((cat) => {
      //These values are used multiple times so popped into an object to avoid repetition of code.
      const nulled =
        cat.best_representation.statistics.null_fraction * rowCount;
      const distinct = calculateDistinctRows(
        rowCount,
        cat.best_representation.statistics.distinct
      );
      const duplicate = rowCount - (nulled + distinct);
      return {
        label: `${cat.name} - ${cat.best_representation.representation_name}`,
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
        //Where the bar chart gets its values.
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
            Select a category from the above table to see further breakdowns.
          </div>
        </div>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    );
  }
  const dataCategory = dataset.stats.categories.find(
    (item) => item.id === categoryId
  ); //Find out which category should be displayed.

  const commonGroups = dataCategory.best_representation.statistics.most_common;
  const commonShare = commonGroups.reduce(
    (acc, item) => acc + item.frequency * rowCount,
    0
  );
  const chartOptions: Highcharts.Options = {
    ...pieChart,
    title: {
      text: `${dataCategory.name} - ${dataCategory.best_representation.representation_name}`,
    },
    series: [
      //Again, where the pie chart gets it's values.
      {
        name: "Best representation breakdown",
        colorByPoint: true,
        type: "pie",
        data: [
          {
            name: "Null occurances",
            y:
              dataCategory.best_representation.statistics.null_fraction *
              rowCount,
          },
          {
            name: "Uncommon entities",
            y:
              rowCount -
              dataCategory.best_representation.statistics.null_fraction *
                rowCount -
              commonShare,
          },
          {
            name: "Common entities",
            drilldown: "Common entities", //Where the drilldown is enabled.
            y: commonShare,
          },
        ],
      },
    ],
    drilldown: {
      series: [
        {
          name: "Common entities",
          id: "Common entities",
          type: "pie",
          data: commonGroups.map((item) => ({
            name: item.value.text,
            y: item.frequency * rowCount,
          })),
        },
      ],
    },
  };

  query.delete("categoryId"); //Removing a part of the query string so when used in the return to overview button.
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
      </div>
      <div className="chart-container">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </div>
  );
};
