GridSpacingTest = TestCase("GridSpacingTest");

GridSpacingTest.prototype.testConstructGridSpacingWithNoValues = function() {
	assertException("expected an exception as GridSpacing always requires at least x and y spacing values", function() {
		new YOKUL.GridSpacing();
	});
};

GridSpacingTest.prototype.testGetXStepSize = function() {
	var g = new YOKUL.GridSpacing(5, 10);
	assertEquals("getXStepSize didn't return expected value", 5, g.getXStepSize());
};

GridSpacingTest.prototype.testGetYStepSize = function() {
	var g = new YOKUL.GridSpacing(5, 10);
	assertEquals("getYStepSize didn't return expected value", 10, g.getYStepSize());
};
