BarSpacingTest = TestCase("BarSpacingTest");

BarSpacingTest.prototype.testConstructBarSpacingWithNoValues = function() {
	var b = new YOKUL.BarSpacing();
	assertEquals("getBarWidth didn't return expected default value", YOKUL.chartTypes.bar.defaults.barWidth, b.getBarWidth());
	assertEquals("betweenBars unexpected value", YOKUL.chartTypes.bar.defaults.betweenBarWidth, b.getBetweenBars());
	assertEquals("betweenGroups unexpected value", YOKUL.chartTypes.bar.defaults.betweenGroupWidth, b.getBetweenGroups());
};

BarSpacingTest.prototype.testConstructWithZeroSpacings = function() {
	var b = new YOKUL.BarSpacing(4, 0, 0);
	assertEquals("getBarWidth didn't return expected default value", 4, b.getBarWidth());
	assertEquals("betweenBars unexpected value", 0, b.getBetweenBars());
	assertEquals("betweenGroups unexpected value", 0, b.getBetweenGroups());
};

BarSpacingTest.prototype.testConstructsBarSpacingWithOnlyBarWidthSpecified = function() {
	var barWidth = 244
	var b = new YOKUL.BarSpacing(barWidth);
	assertEquals("getBarWidth didn't return expected default value", barWidth, b.getBarWidth());
	assertEquals("betweenBars unexpected value", YOKUL.chartTypes.bar.defaults.betweenBarWidth, b.getBetweenBars());
	assertEquals("betweenGroups unexpected value", YOKUL.chartTypes.bar.defaults.betweenGroupWidth, b.getBetweenGroups());
};

BarSpacingTest.prototype.testGetBarWidthWithStaticBarWidth = function() {
	var b = new YOKUL.BarSpacing(12, 2, 2);
	assertEquals("getBarWidth returned unexpected result", 12, b.getBarWidth());
};

BarSpacingTest.prototype.testSetsIsAutomaticBarWidthFlag = function() {
	var b = new YOKUL.BarSpacing('a');
	assertEquals("isAutomaticBarWidth not set correctly", true, b.isAutomaticBarWidth());
	assertEquals("betweenBars unexpected value", YOKUL.chartTypes.bar.defaults.betweenBarWidthSoleA, b.getBetweenBars());
	assertEquals("betweenGroups unexpected value", YOKUL.chartTypes.bar.defaults.betweenGroupWidthSoleA, b.getBetweenGroups());
};

BarSpacingTest.prototype.testThrowsExceptionIfAutomaticBarWidthButCallGetBarWidthWithoutNeededValues = function() {
	var b = new YOKUL.BarSpacing('a');
	assertException("expected an exception because the bar width is set to automatic, so getBarWidth needs some values to calculate the width",
		function() {
			b.getBarWidth();
		});
};

BarSpacingTest.prototype.testCalculatesBarWidthCorrectly = function() {
	var betweenWidth = 5;
	var groupWidth = 6;
	var numBars = 12;
	var numGroups = 3;
	var availableWidth = 300;

	// bw = (CAW - tw(NB) - gw(NG)) / NB
	var expectedWidth = (availableWidth - (betweenWidth * numBars) - (groupWidth * numGroups)) / numBars;

	var b = new YOKUL.BarSpacing('a', betweenWidth, groupWidth);

	assertEquals("calculated bar width unexpected", expectedWidth, b.getBarWidth(numBars, numGroups, availableWidth));
};
