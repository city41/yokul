YOKUL.BarSpacing = function BarSpacing(barWidth, betweenBars, betweenGroups) {
	this._barWidth = barWidth || YOKUL.chartTypes.bar.defaults.barWidth;
	this._betweenBars = betweenBars || YOKUL.chartTypes.bar.defaults.betweenBarWidth;
	this._betweenGroups = betweenGroups || YOKUL.chartTypes.bar.defaults.betweenGroupWidth;
};

YOKUL.BarSpacing.prototype.getBarWidth = function BarSpacing_getBarWidth(numBars, numGroups, availableWidth) {
	if(this._barWidth !== 'a') {
		return this._barWidth;
	} else {	
		if(typeof numBars === 'undefined' || typeof availableWidth === 'undefined') {
			throw new Error("BarSpacing.getBarWidth: barWidth is set to automatic, so please provude numBars and availableWidth parameters");
		}
		return expectedWidth = (availableWidth - (this._betweenBars * numBars) - (this._betweenGroups * numGroups)) / numBars;
	}
};

YOKUL.BarSpacing.prototype.getBetweenBars = function BarSpacing_getBetweenBars() {
	return this._betweenBars;
};

YOKUL.BarSpacing.prototype.getBetweenGroups = function BarSpacing_getBetweenGroups() {
	return this._betweenGroups;
};

YOKUL.BarSpacing.prototype.isAutomaticBarWidth = function BarSpacing_isAutomaticBarWidth() {
	return this._barWidth === 'a';
};


YOKUL.VerticalBarGrouped = function VerticalBarGrouped(id, queryData) {
	var element = document.getElementById(id);

	if(typeof queryData === 'undefined') {
		queryData = YOKUL.utility.getQueryDataFromElement(element);
	}

	var imageData = this._createChartImage(queryData);
	element.src = imageData;
};


YOKUL.VerticalBarGrouped.prototype._getChartAreaWidth = function vbs_getChartAreaWidth(parser) {
	var chartSpacing = parser.chartSpacing();
	
	var areaWidth = 0;

	var data = parser.chartData();

	areaWidth += data[0].length * (chartSpacing.barWidth + chartSpacing.betweenBars) * data.length - chartSpacing.betweenBars;
	areaWidth += data[0].length * chartSpacing.betweenGroups;

	return areaWidth;
};

YOKUL.VerticalBarGrouped.prototype._measureChartArea = function vbs_measureChartArea(context, parser) {
	var chartAreaWidth = this._getChartAreaWidth(parser);

	var measure = { x: 0, y: 0, w: chartAreaWidth, h: parser.size().h };

	// title
	var titleMeasure = parser.title() ? YOKUL.defaults.titleHeight : 0;
	measure.y += titleMeasure;
	measure.h -= titleMeasure;

	// bottom axis
	var bottomAxisHeight = 0;
	var visibleAxes = parser.visibleAxes();
	for(var i = 0; i < visibleAxes.length; ++i) {
		if(visibleAxes[i] == 'x') {
			bottomAxisHeight += YOKUL.defaults.axisLabelHeight;
		}
	}

	measure.h -= bottomAxisHeight;

	function getMaxLabelWidth(index) {
		var labels = parser.axisLabels();

		var max = 0;
		if(labels && labels[index]) {
			for(var i = 0; i < labels.length; ++i) {
				var labelWidth = context.measureText(labels[i]).width;
				if(labelWidth > max) {
					max = labelWidth;
				}
			}
		} else {
			var data = parser.chartData();

			if(data && data[index]) {
				var dataMax = YOKUL.utility.max(data[index]);
				max = context.measureText(dataMax.toString()).width;
			}
		}

		return max;
	}

	// left axis
	var leftAxisWidth = 0;
	for(var i = 0; i < visibleAxes.length; ++i) {
		if(visibleAxes[i] == 'y') {
			leftAxisWidth += getMaxLabelWidth(i); //p.axisLabels()[i]);
		}
	}

	measure.x += leftAxisWidth;

	return measure;
};

YOKUL.VerticalBarGrouped.prototype._getSeriesRange = function vbg_getSeriesRange(index, parser) {
	var specifiedRanges = parser.seriesRanges();

	if(specifiedRanges && specifiedRanges[index]) {
		return specifiedRanges[index];
	}

	if(specifiedRanges && specifiedRanges[0]) {
		return specifiedRanges[0];
	}

	var data = parser.chartData();

	if(data && data[index]) {
		return { min: YOKUL.utility.min(data[index]), max: YOKUL.utility.max(data[index]) };
	}

	return { min: 0, max: 100 };
};

YOKUL.VerticalBarGrouped.prototype._drawChartArea = function vbs_drawChartArea(context, measurement, parser) {
	var chartSpacing = parser.chartSpacing();
	var seriesColors = parser.seriesColors();
	var data = parser.chartData();

	var areaHeight = measurement.h;

	var currentX = measurement.x + chartSpacing.betweenGroups / 2;

	//-0.8,0.8,-0.6|-1.2,1,-0.3|-0.4,1.3,-0.1|-0.1,-0.4,-0.6|-0.3,-0.4,0|0.4,-1.2,0.4|-0.4,-0.4,0.4
	for(var g = 0; g < data[0].length; ++g) {
		for(var i = 0; i < data.length; ++i) {
			var seriesRanges = this._getSeriesRange(i, parser);
			var range = seriesRanges.max - seriesRanges.min;
			var zeroY = measurement.y + areaHeight * (seriesRanges.max / range);

			var value = data[i][g];
			var barValue = areaHeight * (value / range);
			var barHeight = Math.abs(barValue);
			var barY = zeroY;
			if(value > 0) {
				barY = zeroY - barHeight;
			}

			context.save();
			context.fillStyle = seriesColors[i];
			context.fillRect(currentX, barY, chartSpacing.barWidth, barHeight);
			context.restore();
			currentX += chartSpacing.barWidth;
			if(i < data.length - 1) {
				currentX += chartSpacing.betweenBars;
			}
		}
		currentX += chartSpacing.betweenGroups;
	}


};

YOKUL.VerticalBarGrouped.prototype._drawAxes = function vbs_drawAxes(context, measurement, parser) {
	context.strokeStyle = "gray";
	context.beginPath();
	context.moveTo(measurement.x, measurement.y);
	context.lineTo(measurement.x, measurement.y + measurement.h);
	context.lineTo(measurement.x + measurement.w, measurement.y + measurement.h);
	context.moveTo(measurement.x, measurement.y);
	context.closePath();
	context.stroke();
};

YOKUL.VerticalBarGrouped.prototype._drawAxisLabels = function vbs_drawAxisLabels(context, measurement, parser, axis) {
	var visibleAxes = parser.visibleAxes();
	var axisLabels = parser.axisLabels();

	var curAxisIndex = 0;

	function drawLabel(index, labels) {
		var labelHeight = YOKUL.defaults.axisLabelHeight;
		var widthPerLabel = measurement.w / labels.length;
		var curX = widthPerLabel / 2;
		var curY = measurement.y + measurement.h + (labelHeight * (index + 1));

		context.strokeStyle = "Gray";
		context.fillStyle = YOKUL.defaults.axisLabelColor;
		context.font = YOKUL.defaults.axisLabelFont;

		for(var l = 0; l < labels.length; ++l) {
			if(index === 0) {
				context.beginPath();
				context.moveTo(curX, curY - (labelHeight - 4));
				context.lineTo(curX, curY - (labelHeight + 1));
				context.closePath();
				context.stroke();
			}

			var labelWidth = context.measureText(labels[l]).width;
			context.fillText(labels[l], curX - labelWidth / 2, curY);
			curX += widthPerLabel;
		}
	}

	for(var i = 0; i < visibleAxes.length; ++i) {
		if(visibleAxes[i] === axis && axisLabels['axis' + i]) {
			drawLabel(curAxisIndex, axisLabels['axis' + i]);
		}
	}
};

YOKUL.VerticalBarGrouped.prototype._drawTitle = function vbs_drawTitle(context, measurement, parser) {
	var title = parser.title();

	if(title) {
		context.font = YOKUL.defaults.titleFont;
		context.fillStyle = YOKUL.defaults.titleColor;
		var center = measurement.x + measurement.w / 2;
		var measured = context.measureText(title);
		context.fillText(title, center - measured.width / 2, YOKUL.defaults.titleHeight / 2);
	}
};

YOKUL.VerticalBarGrouped.prototype._drawLegend = function vbs_drawLegend(context, measurement, parser) {
	var spacing = 6;
	var entryHeight = 12;
	var legendLabels = parser.legendLabels();
	var seriesColors = parser.seriesColors();
	var legendHeight = (entryHeight+spacing) * legendLabels.length - spacing;

	var startY = context.canvas.height / 2 - legendHeight / 2 + entryHeight;
	var startX = measurement.x + measurement.w + 5;

	for(var i = 0; i < legendLabels.length; ++i) {
		context.save();
		context.fillStyle = seriesColors[i];
		context.fillRect(startX, startY, entryHeight, entryHeight);
		context.fillStyle = "gray";
		context.fillText(legendLabels[i], startX + entryHeight + spacing, startY + ((entryHeight + spacing) / 2));
		context.restore();
		startY += entryHeight + spacing;
	}
};

YOKUL.VerticalBarGrouped.prototype._createChartImage = function VerticalBarGrouped_createChartImage(query) {
	var parser = new YOKUL.Parser(query);

	var canvas = document.createElement('canvas');
	canvas.width = parser.size().w;
	canvas.height = parser.size().h;
	var context = canvas.getContext('2d');

	YOKUL.useContext(context, function(context) {
		context.fillStyle = "#FFFFFF";
		context.fillRect(0, 0, canvas.width, canvas.height);
	});

	var chartAreaMeasure = this._measureChartArea(context, parser);

	var that = this;
	YOKUL.useContext(context, function(context) {
		that._drawChartArea(context, chartAreaMeasure, parser);
	});

	YOKUL.useContext(context, function(context) {
		that._drawAxes(context, chartAreaMeasure, parser);
	});

	YOKUL.useContext(context, function(context) {
		that._drawAxisLabels(context, chartAreaMeasure, parser, 'x');
	});

	YOKUL.useContext(context, function(context) {
		that._drawTitle(context, chartAreaMeasure, parser);
	});

	if(parser.legendSpecified()) {
		YOKUL.useContext(context, function(context) {
			that._drawLegend(context, chartAreaMeasure, parser);
		});
	}

	return canvas.toDataURL('image/png');
};




