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
	assertEquals("chartTypes not set up correctly", "bvg", YOKUL.chartTypes.bar.verticalGrouped);
	var p = new YOKUL.Parser(URL_ROOT + "?cht=bvg");
	assertEquals("cht not parsed correctly", YOKUL.chartTypes.bar.verticalGrouped, p.chartType());
};

ParserTest.prototype.testReportsDataEncodingTypeCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chd=t:_30,-30,50,80,200|4,5,6|-12,4.3,88.8");
	assertEquals("data encoding not reported correctly", 't', p.getDataEncodingType());
	var p = new YOKUL.Parser(URL_ROOT + "?chd=s:TYU5aa");
	assertEquals("data encoding not reported correctly", 's', p.getDataEncodingType());
	var p = new YOKUL.Parser(URL_ROOT + "?chd=e:AAABAC");
	assertEquals("data encoding not reported correctly", 'e', p.getDataEncodingType());
};

ParserTest.prototype.testParsesChd_t_Correctly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chd=t:_30,-30,50,80,200|4,5,6|-12,4.3,88.8");
	assertEquals("chd not parsed correctly", [[null, 30, -30, 50, 80, 200], [4, 5, 6], [-12, 4.3, 88.8 ]], p.chartData());
};

ParserTest.prototype.testParsesChd_s_Correctly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chd=s:BTb19_,Mn5tzb");
	assertEquals("chd not parsed correctly", [[1,19,27,53,61,-1], [12,39,57,45,51,27]], p.chartData());
};

ParserTest.prototype.testParsesChttCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chtt=mytitle");
	assertEquals("chtt not parsed correctly", ['mytitle'], p.title());
	
	var p = new YOKUL.Parser(URL_ROOT + "?chtt=mytitle+with+spaces+in+it");
	assertEquals("chtt not parsed correctly", ['mytitle with spaces in it'], p.title());

	var p = new YOKUL.Parser(URL_ROOT + "?chtt=mytitle+with+spaces+in+it|and+a+line+break");
	assertEquals("chtt not parsed correctly", ['mytitle with spaces in it', 'and a line break'], p.title());
};

ParserTest.prototype.testParsesChtsCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chts=FF0000,20");
	assertEquals("chts not parsed correctly",{ color: "#FF0000", size: 20 }, p.titleStyle());
};

ParserTest.prototype.testParsesChbhWithACorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chbh=a");
	assertTrue("should report its using automatic width", p.chartSpacing().isAutomaticBarWidth());
	assertEquals("between bar width not expected default", YOKUL.chartTypes.bar.defaults.betweenBarWidthSoleA, p.chartSpacing().getBetweenBars());
	assertEquals("between group width not expected default", YOKUL.chartTypes.bar.defaults.betweenGroupWidthSoleA, p.chartSpacing().getBetweenGroups());
};

ParserTest.prototype.testParsesChbhWithPixelValuesCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chbh=12,4,30");
	assertEquals("chbh not parsed correctly", 12, p.chartSpacing().getBarWidth());
	assertEquals("chbh not parsed correctly", 4, p.chartSpacing().getBetweenBars());
	assertEquals("chbh not parsed correctly", 30, p.chartSpacing().getBetweenGroups());
};

ParserTest.prototype.testParsesChbhWithPixelValuesCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chbh=a,4,30");
	assertTrue("should report its using automatic width", p.chartSpacing().isAutomaticBarWidth());
	assertEquals("between bar width not expected default", 4, p.chartSpacing().getBetweenBars());
	assertEquals("between group width not expected default", 30, p.chartSpacing().getBetweenGroups());
};

ParserTest.prototype.testParsesChbhWithZeroValuesCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chbh=a,0,30");
	assertTrue("should report its using automatic width", p.chartSpacing().isAutomaticBarWidth());
	assertEquals("between bar width not expected default", 0, p.chartSpacing().getBetweenBars());
	assertEquals("between group width not expected default", 30, p.chartSpacing().getBetweenGroups());
};

ParserTest.prototype.testCreatesDefaultBarSpacingIfChbhIsNotPresent = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?cht=bvg");
	assertEquals("bar width not expected default", YOKUL.chartTypes.bar.defaults.barWidth, p.chartSpacing().getBarWidth());
	assertEquals("between bar width not expected default", YOKUL.chartTypes.bar.defaults.betweenBarWidth, p.chartSpacing().getBetweenBars());
	assertEquals("between group width not expected default", YOKUL.chartTypes.bar.defaults.betweenGroupWidth, p.chartSpacing().getBetweenGroups());
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

ParserTest.prototype.testParsesChxrCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chxr=0,0,500|1,0,200|2,1000,0");
	assertEquals("chxr not parsed correctly", [[0, 500], [0, 200], [1000,0]], p.axisRanges());
};

ParserTest.prototype.testCreatesDefaultVisibleAxesIfChxtNotPresent = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?cht=bvg");
	assertEquals("chxt not parsed correctly", [], p.visibleAxes());
};

ParserTest.prototype.testVisibleAxesCount = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chxt=x,x,y,x,y,t,t");
	assertEquals("visible axes count not expected for x", 3, p.visibleAxesCount('x'));
	assertEquals("visible axes count not expected for y", 2, p.visibleAxesCount('y')); 
	assertEquals("visible axes count not expected for unknown axis name", 0, p.visibleAxesCount('k'));

};

ParserTest.prototype.testParsesChxlCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chxl=1:|Foo|Bar|Buz%20biz|3:|bbb|aaa");
	assertEquals("chxl not parsed correctly", { axis1: ['Foo', 'Bar', 'Buz biz'], axis3: ['bbb', 'aaa'] }, p.axisLabels());
};

ParserTest.prototype.testHasGridSpacing = function() {
	var hasG = new YOKUL.Parser(URL_ROOT + "?chg=4,5");
	assertTrue("hasGridSpacing, expected true", hasG.hasGridSpacing());

	var noG = new YOKUL.Parser(URL_ROOT + "?cht=bvg");
	assertFalse("hasGridSpacing expected false", noG.hasGridSpacing());
};

ParserTest.prototype.testParsesChgBasicCorrectly = function() {
	var p = new YOKUL.Parser(URL_ROOT + "?chg=12,24");
	assertEquals("chg not parsed correctly", 12, p.gridSpacing().getXStepSize());
	assertEquals("chg not parsed correctly", 24, p.gridSpacing().getYStepSize());
};
