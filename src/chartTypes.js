YOKUL.chartTypes = {
	bar : {
		verticalStacked : 'bvs',
		verticalGrouped : 'bvg',
		verticalOverlapped: 'bvo',
		specific : {
			automaticFitBarWidth: "automaticFitBarWidth"
		},
		defaults: {
			barWidth: 23,
			betweenBarWidth: 4,
			betweenGroupWidth: 8,
			betweenBarWidthSoleA : 3,
			betweenGroupWidthSoleA : 3
		}
	}
};


YOKUL.chartTypesMap = {
	bvs: YOKUL.chartTypes.bar.verticalStacked,
	bvg: YOKUL.chartTypes.bar.verticalGrouped,
	bvo: YOKUL.chartTypes.bar.verticalOverlapped
};


