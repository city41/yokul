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
	var titleMeasure = parser.title() ? 12 : 0;
	measure.y += titleMeasure;
	measure.h -= titleMeasure;

	// bottom axis
	var bottomAxisHeight = 0;
	var visibleAxes = parser.visibleAxes();
	for(var i = 0; i < visibleAxes.length; ++i) {
		if(visibleAxes[i] == 'x') {
			bottomAxisHeight += 12;
		}
	}

	measure.h -= bottomAxisHeight;

	function getMaxLabelWidth(labels) {
		var max = 0;
		for(var i = 0; i < labels.length; ++i) {
			var labelWidth = context.measureText(labels[i]);
			if(labelWidth > max) {
				max = labelWidth;
			}
		}
		return max;
	}

	// left axis
	var leftAxisWidth = 0;
	for(var i = 0; i < visibleAxes.height; ++i) {
		if(visibleAxes[i] == 'y') {
			leftAxisWidth += getMaxLabelWidth(p.axisLabels()[i]);
		}
	}

	measure.x += leftAxisWidth;

	return measure;
};

YOKUL.VerticalBarGrouped.prototype._drawChartArea = function vbs_drawChartArea(context, measurement, parser) {
	var chartSpacing = parser.chartSpacing();
	var seriesColors = parser.seriesColors();
	var data = parser.chartData();
	var seriesRanges = parser.seriesRanges()[0];

	var areaHeight = measurement.h;
	var range = seriesRanges.max - seriesRanges.min;
	var zeroY = measurement.y + areaHeight * (seriesRanges.max / range);

	var currentX = chartSpacing.betweenGroups / 2;

	//-0.8,0.8,-0.6|-1.2,1,-0.3|-0.4,1.3,-0.1|-0.1,-0.4,-0.6|-0.3,-0.4,0|0.4,-1.2,0.4|-0.4,-0.4,0.4
	for(var g = 0; g < data[0].length; ++g) {
		for(var i = 0; i < data.length; ++i) {
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
		var widthPerLabel = measurement.w / labels.length;
		var curX = widthPerLabel / 2;
		var curY = measurement.y + measurement.h + (12 * (index + 1));

		for(var l = 0; l < labels.length; ++l) {
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
	YOKUL.log.info('title: ' + title);

	var center = measurement.x + measurement.w / 2;

	if(title) {
		var measured = context.measureText(title);
		context.fillText(title, center - measured.width / 2, 12);
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

	YOKUL.useContext(context, function(context) {
		that._drawLegend(context, chartAreaMeasure, parser);
	});

	return canvas.toDataURL('image/png');
};




