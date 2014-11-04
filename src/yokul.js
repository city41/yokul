YOKUL = {};
YOKUL.charts = {};

YOKUL.useContext = function YOKUL_useContext(context, callback) {
	context.save();
	callback(context);
	context.restore();
};

YOKUL.utility = {
	getQueryDataFromElement: function utility_getQueryDataFromElement(element) {
		return element.getAttribute("data-src") || element.getAttribute("data-chart-src");
	},

	min: function utility_min(array) {
		var min = Number.MAX_VALUE, i;

		if(!array || !array.length) {
			return undefined;
		}

		for(i = 0; i < array.length; ++i) {
			if(array[i] < min) {
				min = array[i];
			}
		}

		return min;
	},
	max: function utility_max(array) {
		var max = Number.MIN_VALUE, i;

		if(!array || !array.length) {
			return undefined;
		}

		for(i = 0; i < array.length; ++i) {
			if(array[i] > max) {
				max = array[i];
			}
		}

		return max;
	},
	min2d: function utility_min2d(arrays) {
		var curMin = this.min(arrays[0]);
		for(var i = 1; i < arrays.length; ++i) {
			var m = this.min(arrays[i]);
			if(m < curMin) {
				curMin = m;
			}
		}
		return curMin;
	},
	max2d: function utility_max2d(arrays) {
		var curMax = this.max(arrays[0]);
		for(var i = 1; i < arrays.length; ++i) {
			var m = this.max(arrays[i]);
			if(m > curMax) {
				curMax = m;
			}
		}
		return curMax;
	}
};

YOKUL.log = (function() {
	function _log(header, msg) {
		if(YOKUL.logOutput && YOKUL.logOutput[header]) {
			var debugOutput = YOKUL.debugOutput && document.getElementById(YOKUL.debugOutput);
			if(!debugOutput) {
				console.log(header + msg);
			} else {
				var div = document.createElement('div');
				div.className = 'debug-msg';
				div.innerHTML = "<span class='debug-header " + header + "'>" + header + "</span>" + msg + "</span>";
				debugOutput.appendChild(div);
			}
		}
	}

	return {
		info: function(msg) {
			_log("info", msg);
		},
		error: function(msg) {
			_log("error", msg);
		},
		warning: function(msg) {
			_log("warning", msg);
		}
	};
})();

YOKUL.defaults = {
	titleHeight: 24,
	titleFont: "14px sans-serif",
	titleColor: "#444444",
	axisLabelHeight: 16,
	axisLabelFont: "11px sans-serif",
	axisLabelColor: "gray",
	seriesColor: "#ffcc33",
	verticalAxisLabelMargin: 5.5,

	gridLines: {
		dashLength: 4,
		spacingLength: 1
	},

	seriesRangesByDataEncodingType: {
		t: { min: 0, max: 100 },  // basic text values chd=t:34,45,98
		s: { min: 0, max: 61 },		// basic encoding  chd=s:YUw8
		e: { min: 0, max: 4095 }	// extended encoding chd=d:PoqM
	}
};



// Canvas Context extensions
// TODO: Should this be in util? probably
// TODO: this doesn't handle spacing of the dashes yet
if(typeof CanvasRenderingContext2D.prototype.dashedLine !== 'function') {
	CanvasRenderingContext2D.prototype.dashedLine = function(x1, y1, x2, y2, dashLen, spacingLen) {
    	if (typeof dashLen === 'undefined') {
				dashLen = YOKUL.defaults.gridLines.dashLength;
			}

			if(typeof spacingLen === 'undefined') {
				spacingLen = YOKUL.defaults.gridLines.spacingLength;
			}

    	this.beginPath();
    	this.moveTo(x1, y1);

			if(dashLen === 0) {
				this.lineTo(x2, y2);
			} else {

    		var dX = x2 - x1;
    		var dY = y2 - y1;
    		var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    		var dashX = dX / dashes;
    		var dashY = dY / dashes;

    		var q = 0;
    		while (q++ <= dashes) {
     			x1 += dashX;
     			y1 += dashY;
     			this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
    		}
    	}

    	this.stroke();
    	this.closePath();
	};
}

if(typeof Array.prototype.clone !== 'function') {
	Array.prototype.clone = function Array_clone() {
		var other = [], i, l = this.length;

		for(i = 0; i < l; ++i) {
			other.push(this[i]);
		}

		return other;
	};
}

if(typeof Array.prototype.contains !== 'function') {
	Array.prototype.contains = function Array_contains(val) {
		var i = 0, l =  this.length;

		for(; i < l; ++i) {
			if(this[i] === val) {
				return true;
			}
		}
		return false;
	};
}
