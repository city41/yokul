YOKUL.charts.VerticalBarGrouped = function VerticalBarGrouped(queryData) {
	this._imageData = this._createChartImage(queryData);
};

// mixin the base methods
YOKUL.charts._VerticalBarMixin.call(YOKUL.charts.VerticalBarGrouped.prototype);

YOKUL.charts.VerticalBarGrouped.prototype._getChartAreaWidth = function vbg_getChartAreaWidth(parser) {
	var chartSpacing = parser.chartSpacing();

	if(chartSpacing.isAutomaticBarWidth()) {
		return parser.size().w;
	}
	
	var data = parser.chartDataGrouped();

	var barWidth = chartSpacing.getBarWidth();

	var groupSize = data[0].length;
	var groupWidth = (groupSize * barWidth) + ((groupSize - 1) * chartSpacing.getBetweenBars()) + (chartSpacing.getBetweenGroups());

	return data.length * groupWidth;
};

YOKUL.charts.VerticalBarGrouped.prototype._drawChartArea = function vbg_drawChartArea(context, measurement, parser) {
	var chartSpacing = parser.chartSpacing();
	var dataBySeries = parser.chartDataBySeries();
	var data = parser.chartDataGrouped();

	var areaHeight = measurement.h;

	var startingX = measurement.x;

	var barWidth = chartSpacing.getBarWidth(dataBySeries.length * dataBySeries[0].length, dataBySeries.length, measurement.w);

	var groupSize = data[0].length;
	var groupWidth = (groupSize * barWidth) + ((groupSize - 1) * chartSpacing.getBetweenBars()) + (chartSpacing.getBetweenGroups());

	for(var g = 0; g < data.length; ++g) {
		var currentX = startingX + (groupWidth * g) + chartSpacing.getBetweenGroups() / 2 + chartSpacing.getBetweenBars() / 2;
		for(var i = 0; i < data[g].length; ++i) {
			var seriesRanges = this._getSeriesRange(i, parser);
			var range = seriesRanges.max - seriesRanges.min;
			var zeroY = measurement.y + areaHeight * (seriesRanges.max / range);

			var value = data[g][i] || 0;
			var barValue = areaHeight * (value / range);
			var barHeight = Math.abs(barValue);
			var barY = zeroY;
			if(value > 0) {
				barY = zeroY - barHeight;
			}

			context.fillStyle = this._getSeriesColor(i, parser);
			context.fillRect(currentX, barY, barWidth, barHeight);
			
			currentX += barWidth + chartSpacing.getBetweenBars();
		}
	}
};

YOKUL.charts.VerticalBarGrouped.prototype._createChartImage = function VerticalBarGrouped_createChartImage(query) {
	var parser = new YOKUL.Parser(query);

	var canvas = document.createElement('canvas');
	canvas.width = parser.size().w;
	canvas.height = parser.size().h;
	
	var context = canvas.getContext('2d');
	var chartAreaMeasure = this._measureChartArea(context, parser);
	
	this._createChartImageCore(query, parser, context, chartAreaMeasure);
	
	return canvas.toDataURL('image/png');
};




