YOKUL.charts._VerticalBarMixin = (function _VerticalBarMixin() {

	function vbmi_imageData() {
		return this._imageData;
	}

	function vbmi_getTitleHeight(parser) {
		var title = parser.title();

		if(!title) {
			return 0;
		}

		var titleStyle = parser.titleStyle();
		var lineHeight = (titleStyle && (titleStyle.size * 1.33)) || YOKUL.defaults.titleHeight;

		// title is an array of strings, one string is one line of the title
		return lineHeight * title.length;
	}

	function vbmi_measureChartArea(context, parser) {
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
	}


	function vbmi_getAxisRange(index, parser) {
		var axisRanges = parser.axisRanges();
	
		if(axisRanges && axisRanges[index]) {
			var axisRange = axisRanges[index];
			return { min: axisRange[0], max: axisRange[1] };
		}
	
		return YOKUL.defaults.seriesRangesByDataEncodingType[parser.getDataEncodingType()];
	}

	function vbmi_getAxisLabels(index, axisName, parser, span) {
		var allAxisLabels = parser.axisLabels(), axisLabels = null, i;
		
	
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
				firstLabel += 1;
			}
	
			for(i = 0; i <= labelCount; ++i) {
				axisLabels.push(Math.round(firstLabel).toString());
				firstLabel += spacing;
			}
	
		} 
		else {
			var dataCount = parser.chartDataBySeries()[0].length;
			axisLabels = [];
			for(i = 0; i < dataCount; ++i) {
				axisLabels.push(i.toString());
			}
		}
	
		return axisLabels;
	}

	function vbmi_drawAxes(context, measurement, parser) {
		var visibleAxes = parser.visibleAxes().clone(), i;
	
		if(!visibleAxes.contains('x')) {
			visibleAxes.push('x');
		}
	
		if(!visibleAxes.contains('y')) {
			visibleAxes.push('y');
		}

		var drawAxisFunctions = {
			drawXAxis: vbmi_drawXAxis,
			drawYAxis: vbmi_drawYAxis,
			drawTAxis: vbmi_drawTAxis,
			drawRAxis: vbmi_drawRAxis
		};
	
		for(i = 0; i < visibleAxes.length; ++i) {
			drawAxisFunctions['draw' + visibleAxes[i].toUpperCase() + 'Axis'](context, measurement, parser);
		}
	}

	function vbmi_drawAxisLabels(context, measurement, parser, axis) {
		var that = this;
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
	
			if(axis === 't') {
				curY = measurement.y - ((labelHeight * (index + 1)) / 2);
			}
	
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
	
		function drawVerticalLabel(index, labels, drawTicks, offset, offsetX) {
			if(!offset) {
				offset = 0;
			}
	
			if(!offsetX) {
				offsetX = 0;
			}
	
			var x = YOKUL.defaults.verticalAxisLabelMargin / 2 + offsetX;
			var y = measurement.y - offset;
			var totalHeight = measurement.h;
			var step = totalHeight / (labels.length - 1);
	
			for(var l = labels.length - 1; l >= 0; --l) {
				if(drawTicks) {
					context.beginPath();
					context.moveTo(measurement.x + 0.5, y + 0.5);
					context.lineTo(measurement.x - 3 + 0.5, y + 0.5);
					context.closePath();
					context.stroke();
				}
	
				var labelWidth = context.measureText(labels[l]).width;
				
				if(axis === 'r') {
					labelWidth = 0;
				}
	
				var maxWidth = measurement.x - YOKUL.defaults.verticalAxisLabelMargin - 2;
				var curX = x + maxWidth - labelWidth;
				context.fillText(labels[l], curX, y + YOKUL.defaults.axisLabelHeight / 4);
				y += step;
			}
		}
	
		function getOffsetX() {
			if(axis === 'r') {
				return measurement.w + 12;
			}
			return 0;
		}
	
		function getOffsetY() {
			return 0;
		}
	
		var drawLabel = (axis === 'x' || axis === 't') ? drawHorizontalLabel : drawVerticalLabel;
	
		for(var i = 0; i < visibleAxes.length; ++i) {
			if(visibleAxes[i] === axis) {
				drawLabel(curAxisIndex, this._getAxisLabels(i, axis, parser, (axis === 'x' || axis === 'r') ? measurement.w : measurement.h), axis !== 't', getOffsetY(), getOffsetX());
			}
		}
	}


	function vbmi_getSeriesRange(index, parser) {
		var specifiedRanges = parser.seriesRanges();
	
		if(specifiedRanges && specifiedRanges[index]) {
			return specifiedRanges[index];
		}
	
		if(specifiedRanges && specifiedRanges[0]) {
			return specifiedRanges[0];
		}
	
		return YOKUL.defaults.seriesRangesByDataEncodingType[parser.getDataEncodingType()];
	}

	function vbmi_getSeriesColor(index, parser) {
		var seriesColors = parser.seriesColors();
	
		if(seriesColors && seriesColors[index]) {
			return seriesColors[index];
		}
	
		if(seriesColors && seriesColors[index % seriesColors.length]) {
			return seriesColors[index % seriesColors.length];
		}
	
		return YOKUL.defaults.seriesColor;
	}

	function vbmi_drawGrid(context, measurement, parser) {
		context.strokeStyle = "#afafaf";
	
		var gs = parser.gridSpacing();
		var xWidth = Math.ceil(measurement.w * (gs.getXStepSize() / 100));
		var yHeight = Math.ceil(measurement.h * (gs.getYStepSize() / 100));
	
		var curX = measurement.x + xWidth + 0.5;
	
		while(curX <= measurement.x + measurement.w) {
			context.dashedLine(curX, measurement.y + 0.5, curX, measurement.y + 0.5 + measurement.h);
			curX += xWidth;
		}
		context.dashedLine(measurement.x + measurement.w, measurement.y, measurement.x + measurement.w, measurement.y + measurement.h);
	
		var curY = measurement.y + 0.5;
	
		while(curY < measurement.y + measurement.h) {
			context.dashedLine(measurement.x + 0.5, curY, measurement.x + measurement.w + 0.5, curY);
			curY += yHeight;
		}
	}

	function vbmi_drawXAxis(context, measurement, parser) {
		context.strokeStyle = "gray";
		context.beginPath();
		context.moveTo(measurement.x + 0.5, measurement.y + measurement.h + 0.5);
		context.lineTo(measurement.x + measurement.w + 0.5, measurement.y + measurement.h + 0.5);
		context.closePath();
		context.stroke();
	}
	
	function vbmi_drawYAxis(context, measurement, parser) {
		context.strokeStyle = "gray";
		context.beginPath();
		context.moveTo(measurement.x + 0.5, measurement.y + 0.5);
		context.lineTo(measurement.x + 0.5, measurement.y + measurement.h + 0.5);
		context.closePath();
		context.stroke();
	}
	
	function vbmi_drawRAxis(context, measurement, parser) {
		context.strokeStyle = "gray";
		context.beginPath();
		context.moveTo(measurement.x + measurement.w + 0.5, measurement.y + 0.5);
		context.lineTo(measurement.x + measurement.w + 0.5, measurement.y + measurement.h + 0.5);
		context.closePath();
		context.stroke();
	}
	
	function vbmi_drawTAxis(context, measurement, parser) {
		// TODO: this method isn't needed, for the T axis Google just draws the labels not the actual axis
	}

	function vbmi_drawLegend(context, measurement, parser) {
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
	}

	function vbmi_getTitleFont(parser) {
		var titleStyle = parser.titleStyle();
	
		return (titleStyle && titleStyle.size + "px sans-serif") || YOKUL.defaults.titleFont;
	}
	
	function vbmi_getTitleColor(parser) {
		var titleStyle = parser.titleStyle();
	
		return (titleStyle && titleStyle.color) || YOKUL.defaults.titleColor;
	}

	function vbmi_drawTitle(context, measurement, parser) {
		var title = parser.title();
	
		if(title) {
			context.font = vbmi_getTitleFont(parser);
			context.fillStyle = vbmi_getTitleColor(parser);
	
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
			var yStep = vbmi_getTitleHeight(parser) / title.length;
			var vertYOffset = yStep / 3;
	
			for(var i = 0; i < title.length; ++i) {
				var line = title[i];
	
				var measured = context.measureText(line);
				context.fillText(line, center - measured.width / 2, yStep * (i + 1) - vertYOffset);
			}
		}
	}

	function vbmi_createChartImageCore(query, parser, context, chartAreaMeasure) {
	
		YOKUL.useContext(context, function(context) {
			context.fillStyle = "#FFFFFF";
			context.fillRect(0, 0, context.canvas.width, context.canvas.height);
		});
	
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
			that._drawAxisLabels(context, chartAreaMeasure, parser, 'r');
		});
	
		YOKUL.useContext(context, function(context) {
			that._drawAxisLabels(context, chartAreaMeasure, parser, 't');
		});
	
		YOKUL.useContext(context, function(context) {
			that._drawTitle(context, chartAreaMeasure, parser);
		});
	
		if(parser.legendSpecified()) {
			YOKUL.useContext(context, function(context) {
				that._drawLegend(context, chartAreaMeasure, parser);
			});
		}
	}

	return function() {
		this._measureChartArea = vbmi_measureChartArea;
		this._getTitleHeight = vbmi_getTitleHeight;
		this._getAxisRange = vbmi_getAxisRange;
		this._getAxisLabels = vbmi_getAxisLabels;
		this._drawAxes = vbmi_drawAxes;
		this._drawAxisLabels = vbmi_drawAxisLabels;
		this._getSeriesRange = vbmi_getSeriesRange;
		this._getSeriesColor = vbmi_getSeriesColor;
		this._drawGrid = vbmi_drawGrid;

		this._drawLegend = vbmi_drawLegend;
		this._drawTitle = vbmi_drawTitle;
		this._createChartImageCore = vbmi_createChartImageCore;

		this.imageData = vbmi_imageData;
	};
})();



