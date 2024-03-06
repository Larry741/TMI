import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import useSession from "@/hooks/use-Session";
import { CURRENCY_SYMBOLS } from "@/utils/constants";
const FusionCharts = require("fusioncharts");
const Column2D = require("fusioncharts/fusioncharts.charts");
const FusionTheme = require("fusioncharts/themes/fusioncharts.theme.fusion.js");
const { default: ReactFC } = require("react-fusioncharts");

const DoughnutChart = ({ data }: { data: any }) => {
  const { data: sessionData } = useSession();

  const chartConfigs = {
    type: "doughnut2d",
    width: "100%",
    height: "100%",
    dataFormat: "json",
    dataSource: {
      chart: {
        theme: "fusion",
        showvalues: "1",
        numberPrefix: `${CURRENCY_SYMBOLS[`${sessionData.currency as "GBP"}`]}`,
        palettecolors: "#9F47BD, #5142fc, #606B8A, #E9B353",
        labelDisplay: "slant",
        labelFont: "Work Sans",
        labelFontColor: "transparent",
        color: "transparent",
        showLegend: "1",
        showpercentvalues: "1",
        decimals: "1",
        showLabels: "0",
        showValues: "0",
        labelAlpha: "100",
        labelFontSize: "13",
        pieRadius: "110",
        doughnutRadius: "70",
        startingAngle: "310",
        // showTooltip: "1",
        bgcolor: "#131722",
        // valuePosition: "inside",
        // minAngleForValue: "75",
        enablesmartLabel: "0"
      },
      data: data
    }
  };

  ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

  return <ReactFC {...chartConfigs} />;
};

export default React.memo(
  dynamic(() => Promise.resolve(DoughnutChart), {
    ssr: false
  })
);
