YOKUL.chartTypes = {
	bar : {
		verticalStacked : 'bvs',
		verticalGrouped : 'bvg',
		specific : {
			automaticFitBarWidth: "automaticFitBarWidth",
		},
		defaults: {
			barWidth: 23,
			betweenBarWidth: 4,
			betweenGroupWidth: 4
		}
	}
};


YOKUL.chartTypesMap = {
	bvs: YOKUL.chartTypes.bar.verticalStacked,
	bvg: YOKUL.chartTypes.bar.verticalGrouped
};


