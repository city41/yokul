YOKUL.chartTypes = {
	bar : {
		verticalStacked : 'bvs',
		verticalGrouped : 'bvg',
		specific : {
			automaticSpacing : 'a'
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


