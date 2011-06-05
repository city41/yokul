YOKUL.charts.VerticalBarStacked = function VerticalBarStacked(queryData) {
	this._imageData = this._createChartImage(queryData);
};

// mixin the base methods
YOKUL.charts._VerticalBarMixin.call(YOKUL.charts.VerticalBarStacked.prototype);

YOKUL.charts.VerticalBarStacked.prototype._getChartAreaWidth = function vbs_getChartAreaWidth(parser) {
	var chartSpacing = parser.chartSpacing();

	if(chartSpacing.isAutomaticBarWidth()) {
		return parser.size().w;
	}
	
	var data = parser.chartDataGrouped();

	var barWidth = chartSpacing.getBarWidth();

	var groupCount = data.length;
	var totalBarWidth = barWidth + chartSpacing.getBetweenBars();

	return groupCount * totalBarWidth;
};

YOKUL.charts.VerticalBarStacked.prototype._drawChartArea = function vbs_drawChartArea(context, measurement, parser) {
	var chartSpacing = parser.chartSpacing();
	var dataBySeries = parser.chartDataBySeries();
	var data = parser.chartDataGrouped();

	var areaHeight = measurement.h;

	var startingX = measurement.x;

	var barWidth = chartSpacing.getBarWidth(dataBySeries.length * dataBySeries[0].length, dataBySeries.length, measurement.w);
	var totalBarWidth = barWidth + chartSpacing.getBetweenBars();

	for(var g = 0; g < data.length; ++g) {
		var currentX = startingX + (totalBarWidth * g) + chartSpacing.getBetweenBars() / 2;
		var yAccum = 0;

		for(var i = 0; i < data[g].length; ++i) {
			var value = data[g][i] || 0;

			// vertical bar stacked does not render negative values by design
			if(value <= 0) {
				continue;
			}

			var seriesRanges = this._getSeriesRange(i, parser);
			var range = seriesRanges.max - seriesRanges.min;
			var zeroY = measurement.y + areaHeight * (seriesRanges.max / range);

			var barValue = areaHeight * (value / range);
			var barHeight = Math.abs(barValue);
			var barY = zeroY;
			if(value > 0) {
				barY = zeroY - barHeight;
			}

			context.fillStyle = this._getSeriesColor(i, parser);
			context.fillRect(currentX, barY - yAccum, barWidth, barHeight);
			
			yAccum += barHeight;
		}
	}
};

YOKUL.charts.VerticalBarStacked.prototype._createChartImage = function vbs_createChartImage(query) {
	var parser = new YOKUL.Parser(query);

	var canvas = document.createElement('canvas');
	canvas.width = parser.size().w;
	canvas.height = parser.size().h;
	
	var context = canvas.getContext('2d');
	var chartAreaMeasure = this._measureChartArea(context, parser);
	
	this._createChartImageCore(query, parser, context, chartAreaMeasure);
	
	return canvas.toDataURL('image/png');
};




