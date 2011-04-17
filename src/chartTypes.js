YOKUL.chartTypes = {
	bar : {
		verticalStacked : 'bvs',
		verticalGrouped : 'bvg',
		specific : {
			automaticSpacing : { barWidth: 23, betweenBars: 4, betweenGroups: 4 }
		},
		defaults: {
			barWidth: 23,
			betweenBarWidth: 0,
			betweenGroupWidth: 0
		}
	}
};


YOKUL.chartTypesMap = {
	bvs: YOKUL.chartTypes.bar.verticalStacked,
	bvg: YOKUL.chartTypes.bar.verticalGrouped
};


