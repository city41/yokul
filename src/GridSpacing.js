YOKUL.GridSpacing = function GridSpacing(xStepSize, yStepSize, dashLength, spaceLength, xOffset, yOffset) {
	if(typeof xStepSize === 'undefined') {
		throw new Error("GridSpacing: xStepSize is required");
	}

	if(typeof yStepSize === 'undefined') {
		throw new Error("GridSpacing: yStepSize is required");
	}

	this._xStepSize = xStepSize;
	this._yStepSize = yStepSize;

	if(dashLength || spaceLength || xOffset || yOffset) {
		throw new Error("GridSpacing: optional features arent implemented yet");
	}
};

YOKUL.GridSpacing.prototype.getXStepSize = function GridSpacing_getXStepSize() {
	return this._xStepSize;
};

YOKUL.GridSpacing.prototype.getYStepSize = function GridSpacing_getYStepSize() {
	return this._yStepSize;
};


