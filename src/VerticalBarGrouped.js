
YOKUL.VerticalBarGrouped = function VerticalBarGrouped(queryData) {
	this._imageData = this._createChartImage(queryData);
};

YOKUL.VerticalBarGrouped.prototype.imageData = function vbg_imageData() {
	return this._imageData;
};

YOKUL.VerticalBarGrouped.prototype._getChartAreaWidth = function vbg_getChartAreaWidth(parser) {
	var chartSpacing = parser.chartSpacing();

	if(chartSpacing.isAutomaticBarWidth()) {
		return parser.size().w;
	}
	
	var areaWidth = 0;

	var data = parser.chartData();

	areaWidth += data[0].length * (chartSpacing.getBarWidth() + chartSpacing.getBetweenBars()) * data.length - chartSpacing.getBetweenBars();
	areaWidth += data[0].length * chartSpacing.getBetweenGroups();

	return areaWidth;
};

YOKUL.VerticalBarGrouped.prototype._getTitleHeight = function vbg_getTitleHeight(parser) {
	var title = parser.title();

	if(!title) {
		return 0;
	}

	var titleStyle = parser.titleStyle();
	
	var lineHeight = (titleStyle && (titleStyle.size * 1.33)) || YOKUL.defaults.titleHeight;

	// title is an array of strings, one string is one line of the title
	return lineHeight * title.length;
};

YOKUL.VerticalBarGrouped.prototype._measureChartArea = function vbg_measureChartArea(context, parser) {
	var chartAreaWidth = this._getChartAreaWidth(parser);

	var measure = { x: 0, y: 0, w: chartAreaWidth, h: parser.size().h };

	// title
	var titleMeasure = this._getTitleHeight(parser);
	measure.y += titleMeasure;
	measure.h -= titleMeasure;

	// bottom axis
	var bottomAxisHeight = 1;
	if(parser.visibleAxesCount('y') > 0) {
		bottomAxisHeight += YOKUL.defaults.axisLabelHeight / 2;
	}

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
			var data = parser.chartData();

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
	measure.w -= leftAxisWidth;

	return measure;
};

YOKUL.VerticalBarGrouped.prototype._getAxisLabels = function vbg_getAxisLabels(index, axisName, parser, span) {
	var allAxisLabels = parser.axisLabels();

	var axisLabels = null;
	

	if(allAxisLabels && allAxisLabels['axis' + index]) {
		axisLabels = allAxisLabels['axis' + index];
	} 
	else if(axisName === 'y' || axisName === 'r') {
		axisLabels = [];
		var labelCount = 10;// Math.min(11, Math.floor(span / 10));

		var axisRange = this._getAxisRange(index, parser);
		var spacing = (axisRange.max - axisRange.min) / labelCount;
		var firstLabel = axisRange.min;

		while(firstLabel % spacing !== 0) {
			++firstLabel;
		}

		for(var i = 0; i <= labelCount; ++i) {
			axisLabels.push(Math.round(firstLabel).toString());
			firstLabel += spacing;
		}

	} 
	else {
		var dataCount = parser.chartData()[0].length;
		axisLabels = [];
		for(var i = 0; i < dataCount; ++i) {
			axisLabels.push(i.toString());
		}
	}

	return axisLabels;
};


YOKUL.VerticalBarGrouped.prototype._getSeriesRange = function vbg_getSeriesRange(index, parser) {
	var specifiedRanges = parser.seriesRanges();

	if(specifiedRanges && specifiedRanges[index]) {
		return specifiedRanges[index];
	}

	if(specifiedRanges && specifiedRanges[0]) {
		return specifiedRanges[0];
	}

	return YOKUL.defaults.seriesRangesByDataEncodingType[parser.getDataEncodingType()];
};

YOKUL.VerticalBarGrouped.prototype._getAxisRange = function vbg_getAxisRange(index, parser) {
	var axisRanges = parser.axisRanges();

	if(axisRanges && axisRanges[index]) {
		var axisRange = axisRanges[index];
		return { min: axisRange[0], max: axisRange[1] };
	}

	return YOKUL.defaults.seriesRangesByDataEncodingType[parser.getDataEncodingType()];
};

YOKUL.VerticalBarGrouped.prototype._getSeriesColor = function vbg_getSeriesColor(index, parser) {
	var seriesColors = parser.seriesColors();

	if(seriesColors && seriesColors[index]) {
		return seriesColors[index];
	}

	if(seriesColors && seriesColors[index % seriesColors.length]) {
		return seriesColors[index % seriesColors.length];
	}

	return YOKUL.defaults.seriesColor;
};

YOKUL.VerticalBarGrouped.prototype._drawChartArea = function vbg_drawChartArea(context, measurement, parser) {
	var chartSpacing = parser.chartSpacing();
	var data = parser.chartData();

	var areaHeight = measurement.h;

	var currentX = measurement.x + chartSpacing.getBetweenGroups() / 2;
	currentX += parser.visibleAxesCount('y');

	var barWidth = chartSpacing.getBarWidth(data.length * data[0].length, data.length, measurement.w);

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
			context.fillStyle = this._getSeriesColor(i, parser);
			context.fillRect(currentX, barY, barWidth, barHeight);
			context.restore();
			currentX += barWidth;
			if(i < data.length - 1) {
				currentX += chartSpacing.getBetweenBars();
			}
		}
		currentX += chartSpacing.getBetweenGroups();
	}
};

YOKUL.VerticalBarGrouped.prototype._drawGrid = function vbg_drawGrid(context, measurement, parser) {
	context.strokeStyle = "gray";

	var gs = parser.gridSpacing();
	var xWidth = Math.ceil(measurement.w * (gs.getXStepSize() / 100));
	var yHeight = Math.ceil(measurement.h * (gs.getYStepSize() / 100));

	var curX = measurement.x + xWidth + .5;

	while(curX <= measurement.x + measurement.w) {
		context.dashedLine(curX, measurement.y + .5, curX, measurement.y + .5 + measurement.h);
		curX += xWidth;
	}

	var curY = measurement.y + .5;

	while(curY < measurement.y + measurement.h) {
		context.dashedLine(measurement.x + .5, curY, measurement.x + measurement.w + .5, curY);
		curY += yHeight;
	}
};

YOKUL.VerticalBarGrouped.prototype._drawAxes = function vbg_drawAxes(context, measurement, parser) {
	context.strokeStyle = "gray";
	context.beginPath();
	context.moveTo(measurement.x + .5, measurement.y + .5);
	context.lineTo(measurement.x + .5, measurement.y + measurement.h + .5);
	context.lineTo(measurement.x + measurement.w + .5, measurement.y + measurement.h + .5);
	context.moveTo(measurement.x + .5, measurement.y + .5);
	context.closePath();
	context.stroke();
};


YOKUL.VerticalBarGrouped.prototype._drawAxisLabels = function vbg_drawAxisLabels(context, measurement, parser, axis) {
	var visibleAxes = parser.visibleAxes();

	var curAxisIndex = 0;

	context.strokeStyle = "Gray";
	context.fillStyle = YOKUL.defaults.axisLabelColor;
	context.font = YOKUL.defaults.axisLabelFont;

	function drawHorizontalLabel(index, labels, drawTicks) {
		var labelHeight = YOKUL.defaults.axisLabelHeight;
		var widthPerLabel = measurement.w / labels.length;
		var curX = measurement.x + widthPerLabel / 2;
		var curY = measurement.y + measurement.h + (labelHeight * (index + 1));

		for(var l = 0; l < labels.length; ++l) {
			if(drawTicks) {
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

	function drawVerticalLabel(index, labels, drawTicks, offset) {
		if(!offset) {
			offset = 0;
		}

		var x = YOKUL.defaults.verticalAxisLabelMargin / 2;
		var y = measurement.y - offset;
		var totalHeight = measurement.h;
		var step = totalHeight / (labels.length - 1);

		for(var l = labels.length - 1; l >= 0; --l) {
			if(drawTicks) {
				context.beginPath();
				context.moveTo(measurement.x + .5, y + .5);
				context.lineTo(measurement.x - 3 + .5, y + .5);
				context.closePath();
				context.stroke();
			}

			var labelWidth = context.measureText(labels[l]).width;
			var maxWidth = measurement.x - YOKUL.defaults.verticalAxisLabelMargin - 2;
			var curX = x + maxWidth - labelWidth;
			context.fillText(labels[l], curX, y + YOKUL.defaults.axisLabelHeight/ 2);
			y += step;
		}
	}

	var drawLabel = (axis === 'x' || axis === 't') ? drawHorizontalLabel : drawVerticalLabel;

	for(var i = 0; i < visibleAxes.length; ++i) {
		if(visibleAxes[i] === axis) {
			drawLabel(curAxisIndex, this._getAxisLabels(i, axis, parser, (axis === 'x' || axis === 'r') ? measurement.w : measurement.h), true);
		}
	}
};

YOKUL.VerticalBarGrouped.prototype._getTitleFont = function vbg_getTitleFont(parser) {
	var titleStyle = parser.titleStyle();

	return (titleStyle && titleStyle.size + "px sans-serif") || YOKUL.defaults.titleFont;
};

YOKUL.VerticalBarGrouped.prototype._getTitleColor = function vbg_getTitleColor(parser) {
	var titleStyle = parser.titleStyle();

	return (titleStyle && titleStyle.color) || YOKUL.defaults.titleColor;
};

YOKUL.VerticalBarGrouped.prototype._drawTitle = function vbg_drawTitle(context, measurement, parser) {
	var title = parser.title();

	if(title) {
		context.font = this._getTitleFont(parser);
		context.fillStyle = this._getTitleColor(parser);

		var widthBasis = 0;

		// the title should center itself on the chart area
		// but if the chart area is larger than the chart itself,
		// then it should center itself on the available chart area
		if(measurement.x + measurement.w > context.canvas.width) {
			widthBasis = context.canvas.width - measurement.x;
		} else {
			widthBasis = measurement.w;
		}

		var center = measurement.x + widthBasis / 2;
		var yStep = this._getTitleHeight(parser) / title.length;
		var vertYOffset = yStep / 3;

		for(var i = 0; i < title.length; ++i) {
			var line = title[i];

			var measured = context.measureText(line);
			context.fillText(line, center - measured.width / 2, yStep * (i + 1) - vertYOffset);
		}
	}
};

YOKUL.VerticalBarGrouped.prototype._drawLegend = function vbg_drawLegend(context, measurement, parser) {
	var spacing = 6;
	var entryHeight = 12;
	var legendLabels = parser.legendLabels();
	var seriesColors = parser.seriesColors();
	var legendHeight = (entryHeight+spacing) * legendLabels.length - spacing;

	var startY = context.canvas.height / 2 - legendHeight / 2 + entryHeight;
	var startX = measurement.x + measurement.w + 5;

	for(var i = 0; i < legendLabels.length; ++i) {
		context.save();
		context.fillStyle = this._getSeriesColor(i, parser);
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

	if(parser.hasGridSpacing()) {
		YOKUL.useContext(context, function(context) {
			that._drawGrid(context, chartAreaMeasure, parser);
		});
	}

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
		that._drawAxisLabels(context, chartAreaMeasure, parser, 'y');
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




