import React, { useEffect } from "react";
import dynamic from "next/dynamic";
const FusionCharts = require("fusioncharts");
const Column2D = require("fusioncharts/fusioncharts.charts");
const FusionTheme = require("fusioncharts/themes/fusioncharts.theme.fusion.js");
const { default: ReactFC } = require("react-fusioncharts");

const LineChart = ({
	categories,
	dataset,
}: {
	categories: any[];
	dataset: any[];
}) => {
	const chartConfigs = {
		type: "scrollcombi2d",
		width: "100%",
		height: "100%",
		dataFormat: "json",
		dataSource: {
			chart: {
				theme: "fusion",
				palettecolors: "#2055F3, #2055F3",
				caption: "",
				subCaption: "",
				xAxisname: "",
				yAxisName: "",
				baseFont: "Work Sans",
				baseFontSize: "13",
				baseFontColor: "#00000099",
				labelFont: "Work Sans",
				labelFontColor: "#000000",
				labelAlpha: "100",
				labelFontSize: "13",
				numDivLines: "2",
				plotHoverEffect: "0",
				anchorRadius: "4",
				anchorBorderColor: "#FFFFFF",
				anchorBorderThickness: "2",
				anchorBgColor: "#2055F3",
				lineThickness: 1,
				numvisibleplot: "12",
				flatscrollbars: "0",
				scrollheight: "12",
				scrollshowbuttons: "1",
				plotFillAlpha: "15",
				plotFillAngle: "90",
				shadow: "0",
			},
			categories: categories,
			dataset: dataset,
		},
	};

	ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

	return <ReactFC {...chartConfigs} />;
};

export default dynamic(() => Promise.resolve(LineChart), {
	ssr: false,
});
