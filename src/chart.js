YOKUL.Chart = function Chart(id) {
	var element = document.getElementById(id);

	if(element && element.dataset["src"]) {
		var image = this._createChartImage(element.dataset["src"]);
		element.src = image;
	}
};

YOKUL.Chart.prototype._createBars = function Chart_createBars(context, data) {
	context.save();
	context.fillStyle = "#ffcc33";

	var barWidth = context.canvas.width / data.length;

	var spacing = 4;

	for(var i = 0; i < data.length; ++i) {
		context.fillRect(i * barWidth + spacing /2, context.canvas.height - data[i], barWidth - spacing, data[i]);
	}

	context.restore();
};

YOKUL.Chart.prototype._createAxis = function Chart_createAxis(context) {
	context.save();

	context.strokeStyle = "#afafaf";

	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(0, context.canvas.height);
	context.lineTo(context.canvas.width, context.canvas.height);
	context.stroke();


	context.restore();
};


YOKUL.Chart.prototype._createChartImage = function Chart_createChartImage(src) {
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




