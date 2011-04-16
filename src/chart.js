YOKUL.VerticalBarStacked = function VerticalBarStacked(id, queryData) {
	var element = document.getElementById(id);

	if(typeof queryData === 'undefined') {
		queryData = YOKUL.utility.getQueryDataFromElement(element);
	}

	var imageData = this._createChartImage(queryData);
	element.src = imageData;
};

YOKUL.VerticalBarStacked.prototype._createBars = function VerticalBarStacked_createBars(context, data) {
	context.save();
	context.fillStyle = "#ffcc33";

	var barWidth = context.canvas.width / data.length;

	var spacing = 4;

	for(var i = 0; i < data.length; ++i) {
		context.fillRect(i * barWidth + spacing /2, context.canvas.height - data[i], barWidth - spacing, data[i]);
	}

	context.restore();
};

YOKUL.VerticalBarStacked.prototype._createAxis = function VerticalBarStacked_createAxis(context) {
	context.save();

	context.strokeStyle = "#afafaf";

	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(0, context.canvas.height);
	context.lineTo(context.canvas.width, context.canvas.height);
	context.stroke();


	context.restore();
};


YOKUL.VerticalBarStacked.prototype._createChartImage = function VerticalBarStacked_createChartImage(src) {
	var parser = new YOKUL.Parser(src);

	var canvas = document.createElement('canvas');
	canvas.width = parser.size().w;
	canvas.height = parser.size().h;

	var context = canvas.getContext('2d');
	context.fillStyle = "#FFFFFF";
	context.fillRect(0, 0, canvas.width, canvas.height);

	this._createBars(context, parser.chartData());

	this._createAxis(context);

	return canvas.toDataURL('image/png');
};




