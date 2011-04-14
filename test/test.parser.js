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
	var p = new YOKUL.Parser(URL_ROOT + "?chd=t:_30,-30,50,80,200");
	assertEquals("chd not parsed correctly", [null, 30, -30, 50, 80, 200], p.chartData());
};

ParserTest.prototype.testParsesChttCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chtt=mytitle");
	assertEquals("chtt not parsed correctly", 'mytitle',p.title());
};

ParserTest.prototype.testParsesChbhCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chbh=a");
	assertEquals("chbh not parsed correctly", YOKUL.chartTypes.bar.specific.automaticSpacing, p.chartSpacing());
};

