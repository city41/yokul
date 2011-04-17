ParserTest = TestCase("ParserTest");

var URL_ROOT = "http://charts.apis.google.com/chart";

ParserTest.prototype.testThrowsExceptionIfNoInputProvided = function() {
	assertException("expected an exception since constructing without any input", function() {
		new YOKUL.Parser();
	});
};

ParserTest.prototype.testParsesChsCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chs=123x456");
	assertEquals("chs not parsed correctly", { w: 123, h: 456 }, p.size());
};

ParserTest.prototype.testParsesChtCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?cht=bvs");
	assertEquals("cht not parsed correctly", YOKUL.chartTypes.bar.verticalStacked, p.chartType());
};

ParserTest.prototype.testParsesChdCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chd=t:_30,-30,50,80,200|4,5,6|-12,4.3,88.8");
	assertEquals("chd not parsed correctly", [[null, 30, -30, 50, 80, 200], [4, 5, 6], [-12, 4.3, 88.8 ]], p.chartData());
};

ParserTest.prototype.testParsesChttCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chtt=mytitle");
	assertEquals("chtt not parsed correctly", 'mytitle',p.title());
	var p = new YOKUL.Parser(URL_ROOT + "?chtt=mytitle+with+spaces+in+it");
	assertEquals("chtt not parsed correctly", 'mytitle with spaces in it',p.title());
};

ParserTest.prototype.testParsesChbhWithACorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chbh=a");
	assertEquals("chbh not parsed correctly", { 
		barWidth: YOKUL.chartTypes.bar.specific.automaticFitBarWidth, 
		betweenBars: YOKUL.chartTypes.bar.defaults.betweenBarWidth,
		betweenGroups: YOKUL.chartTypes.bar.defaults.betweenGroupWidth
	}, p.chartSpacing()); 
};

ParserTest.prototype.testParsesChbhWithPixelValuesCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chbh=12,4,30");
	assertEquals("chbh not parsed correctly", { barWidth: 12, betweenBars: 4, betweenGroups: 30 }, p.chartSpacing());
};

ParserTest.prototype.testParsesChbhWithPixelValuesCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chbh=a,4,30");
	assertEquals("chbh not parsed correctly", { barWidth: YOKUL.chartTypes.bar.specific.automaticFitBarWidth, betweenBars: 4, betweenGroups: 30 }, p.chartSpacing());
};

ParserTest.prototype.testParsesChdsCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chds=-40.4,110.88,-1.3,2.5");
	assertEquals("chds not parsed correctly", [{ min: -40.4, max: 110.88 }, { min: -1.3, max: 2.5 }], p.seriesRanges()); 
};

ParserTest.prototype.testParsesChdlCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chdl=foo|bar%20baz|buz");
	assertEquals("chdl not parsed correctly", ["foo", "bar baz", "buz"], p.legendLabels());
};

ParserTest.prototype.testParsesChcoCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chco=FF0000,00FF00,0000FF");
	assertEquals("chco not parsed correctly", ["#FF0000", "#00FF00", "#0000FF"], p.seriesColors());
};

ParserTest.prototype.testParsesChxtCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chxt=x,x,y,r,t,t");
	assertEquals("chxt not parsed correctly", ['x', 'x', 'y', 'r', 't', 't'], p.visibleAxes());
};

ParserTest.prototype.testParsesChxlCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chxl=1:|Foo|Bar|Buz%20biz|3:|bbb|aaa");
	assertEquals("chxl not parsed correctly", { axis1: ['Foo', 'Bar', 'Buz biz'], axis3: ['bbb', 'aaa'] }, p.axisLabels());
};
