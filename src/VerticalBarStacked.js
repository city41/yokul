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

YOKUL.charts.VerticalBarStacked.prototype._measureChartArea = function vbs_measureChartArea(context, parser) {
	var chartAreaWidth = this._getChartAreaWidth(parser);

	var measure = { x: 0, y: 0, w: chartAreaWidth, h: parser.size().h };

	// title
	var titleMeasure = this._getTitleHeight(parser);
	measure.y += titleMeasure;
	measure.h -= titleMeasure;

	// bottom axis
	var bottomAxisHeight = 1 + (parser.visibleAxesCount('y') * (YOKUL.defaults.axisLabelHeight / 4));

	bottomAxisHeight += parser.visibleAxesCount('x') * YOKUL.defaults.axisLabelHeight;

	measure.h -= bottomAxisHeight;

	// top axis
	var topAxisHeight = 6;
	topAxisHeight += parser.visibleAxesCount('t') * YOKUL.defaults.axisLabelHeight;

	measure.y += topAxisHeight;
	measure.h -= topAxisHeight;

	var that = this;

	function getMaxLabelWidth(index, axisName) {
		var labels = that._getAxisLabels(index, axisName, parser, measure.h);

		var max = 0;
		if(labels && labels[index]) {
			for(var i = 0; i < labels.length; ++i) {
				var labelWidth = context.measureText(labels[i]).width;
				if(labelWidth > max) {
					max = labelWidth;
				}
			}
		} else {
			var data = parser.chartDataBySeries();

			if(data && data[index]) {
				var dataMax = YOKUL.utility.max(data[index]);
				max = context.measureText(dataMax.toString()).width;
			}
		}

		// there is a margin on both sides
		return max + YOKUL.defaults.verticalAxisLabelMargin * 2;
	}

	// left axis
	var leftAxisWidth = 1;
	var visibleAxes = parser.visibleAxes();
	for(var i = 0; i < visibleAxes.length; ++i) {
		if(visibleAxes[i] == 'y') {
			leftAxisWidth += getMaxLabelWidth(i, 'y');
		}
	}

	measure.x += leftAxisWidth;

	if(parser.chartSpacing().isAutomaticBarWidth()) {
		measure.w -= leftAxisWidth + 1;
	}

	return measure;
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




