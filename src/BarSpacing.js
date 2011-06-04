YOKUL.BarSpacing = function BarSpacing(barWidth, betweenBars, betweenGroups) {
	this._barWidth = barWidth || YOKUL.chartTypes.bar.defaults.barWidth;
 
	if(this._barWidth === 'a' && betweenBars === undefined) {
		this._betweenBars = 3;
	} else {
		this._betweenBars = (betweenBars === undefined) ? YOKUL.chartTypes.bar.defaults.betweenBarWidth : betweenBars;
	}
 
	if(this._barWidth === 'a' && betweenGroups === undefined) {
		this._betweenGroups = 3;
	} else {
		this._betweenGroups = (betweenGroups === undefined) ?  YOKUL.chartTypes.bar.defaults.betweenGroupWidth : betweenGroups;
	}
}; 

YOKUL.BarSpacing.prototype.getBarWidth = function BarSpacing_getBarWidth(numBars, numGroups, availableWidth) {
	if(this._barWidth !== 'a') {
		return this._barWidth;
	} else {	
		if(typeof numBars === 'undefined' || typeof availableWidth === 'undefined') {
			throw new Error("BarSpacing.getBarWidth: barWidth is set to automatic, so please provude numBars and availableWidth parameters");
		}
		return (availableWidth - (this._betweenBars * numBars) - (this._betweenGroups * numGroups)) / numBars;
	}
};

YOKUL.BarSpacing.prototype.getBetweenBars = function BarSpacing_getBetweenBars() {
	return this._betweenBars;
};

YOKUL.BarSpacing.prototype.getBetweenGroups = function BarSpacing_getBetweenGroups() {
	return this._betweenGroups;
};

YOKUL.BarSpacing.prototype.isAutomaticBarWidth = function BarSpacing_isAutomaticBarWidth() {
	return this._barWidth === 'a';
};

