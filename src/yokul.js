YOKUL = {
	createChart: function(imgId, query) {
		return new YOKUL.VerticalBarGrouped(imgId, query);
	}
};

YOKUL.useContext = function YOKUL_useContext(context, callback) {
	context.save();
	callback(context);
	context.restore();
};

YOKUL.utility = {
	getQueryDataFromElement: function utility_getQueryDataFromElement(element) {
		return element.dataset["src"] || element.dataset["chart-src"];
	},

	min: function utility_min(array) {
		if(!array || !array.length) {
			return undefined;
		}
	
		var min = 99999999999;
		for(var i = 0; i < array.length; ++i) {
			if(array[i] < min) {
				min = array[i];
			}
		}

		return min;
	},
	max: function utility_max(array) {
		if(!array || !array.length) {
			return undefined;
		}
	
		var max = -99999999999;
		for(var i = 0; i < array.length; ++i) {
			if(array[i] > max) {
				max = array[i];
			}
		}

		return max;
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
	axisLabelHeight: 12,
	axisLabelFont: "11px sans-serif",
	axisLabelColor: "gray"
};
