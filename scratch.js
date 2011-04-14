
//http://chart.apis.google.com/chart?chbh=a&chs=200x100&cht=bvs&chd=t:_30,-30,50,80,200&chtt=testing
<img class="charts" data-src="http://chart.apis.google.com/chart?chbh=a&chs=200x100&cht=bvs&chd=s:SYf&chtt=testing" />

chbh = bar width and spacing
chs = chart size <width>x<height>
cht = chart type
chd = chart data
chtt = chart title

SMARTYCHART.convert('.charts');


SMARTYCHART.convert = function(selector) {
	var images = getImagesBasedOnSelector(selector);

	var charts = [];

	for(var i = 0; i < images.length; ++i) {
		charts.push(SMARTYCHART.create(images));
	}

}


SMARTYCHART.constructors = {
	Bar: Bar
}


SMARTYCHART.create(domElement) {
	var url = domElement.dataset["src"];

	var parser = new ChartUrlParser(url);


	return SMARTYCHART.constructors[parser.chartType()](parser);
}




var Chart = function Chart() {
}

Chart.prototype._init = function Chart_init(parser) {
	this._size = parser.size();
	this._chartType = parser.chartType();
	this._t
};


var Bar = function Bar(parser) {
	this._parser = parser;
	this._init(this._parser);
}

Bar.prototype = new Chart();
Bar.prototype.constructor = Bar;
Bar.superclass = Chart.prototype;
Bar.prototype._init = function Bar_init(parser) {
	Bar.superclass.init.call(this, parser);
};


	
var Parser = function Parser(url) {
	this._parse(url);
}

Parser.prototype._parse = function Parser_parse(url) {
	var tokenizer = new Tokenizer(url);

	while(tokenizer.moveNext()) {
		this._parseToken(tokenizer.current());
	}
};

Parser.prototype._parseToken = function Parser_parseToken(token) {
};


