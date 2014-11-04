YOKUL.Parser = (function() {

	var _chd_handlers = {
		t: function Parser_chd_t(value) {

			function parseOneSet(set) {
				set = set.replace(/_/g, ",null,");

				var data = [];
				var _split = set.split(',');

				for(var i = 0; i < _split.length; ++i){
					var s = _split[i];

					if(s !== undefined && s !== '') {
						if(s === 'null') {
							data.push(null);
						} else {
							data.push(parseFloat(s));
						}
					}
				}

				return data;
			}

			var allData = [];
			var split = value.split('|');

			for(var i = 0; i < split.length; ++i) {
				allData.push(parseOneSet(split[i]));
			}

			return allData;
		},
		s: function Parser_chd_t(value) {
			function decode(c) {
				if(c >= 'A' && c <= 'Z') {
					return c.charCodeAt(0) - 'A'.charCodeAt(0);
				} else if(c >= 'a' && c <= 'z') {
					return c.charCodeAt(0) - 'a'.charCodeAt(0) + 26;
				} else if(c >= '0' && c <= '9') {
					return c.charCodeAt(0) - '0'.charCodeAt(0) + 52;
				} else {
					return -1;
				}
			}

			function parseOneSet(set) {
				var data = [];
				for(var i = 0; i < set.length; ++i) {
					data.push(decode(set.charAt(i)));
				}

				return data;
			}

			var allData = [];
			var split = value.split(',');
			for(var i = 0; i < split.length; ++i) {
				allData.push(parseOneSet(split[i]));
			}

			return allData;
		}
	};

	var _handlers = {
		chs: function Parser_chs(value) {
			var split = value.split('x');
			if(split.length !== 2) {
				throw new Error("Parser:chs: unexpected input: " + value);
			}

			this._size = { w: parseInt(split[0], 10), h: parseInt(split[1], 10) };

			if(this._size.w > 1000) {
				YOKUL.log.warning("Width, " + this._size.w + ", is greater than Google's maximum of 1000");
			}
			if(this._size.h > 1000) {
				YOKUL.log.warning("Height, " + this._size.h + ", is greater than Google's maximum of 1000");
			}
		},

		cht: function Parser_cht(value) {
			this._chartType = YOKUL.chartTypesMap[value];
			if(this._chartType === undefined) {
				throw new Error("Parser::cht: unknown value: " + value);
			}
		},

		chd: function Parser_chd(value) {
			var splitOnColon = value.split(':');

			if(splitOnColon.length !== 2) {
				throw new Error("Parser::chd: unknown value: " + value);
			}

			this._dataEncodingType = splitOnColon[0];

			this._chartDataBySeries = _chd_handlers[this._dataEncodingType](splitOnColon[1]);
		},

		chtt: function Parser_chtt(value) {
			value = value.replace(/\+/g, ' ');
			this._title = value.split('|');
		},

		chts: function Parser_chts(value) {
			var split = value.split(',');

			if(split.length !== 2) {
				throw new Error("Parser::chts: unexpected value: " + value);
			}

			this._titleStyle = { color: '#' + split[0], size: parseInt(split[1], 10) };
		},

		chbh: function Parser_chbh(value) {
			var barWidth, betweenBars, betweenGroups;
			var split = value.split(',');

			// bar width
			if(split.length > 0) {
				if(split[0] === 'a') {
					barWidth = 'a';
				} else {
					barWidth = parseInt(split[0], 10);
					if(isNaN(barWidth)) {
						barWidth = YOKUL.chartTypes.bar.defaults.barWidth;
					}
				}
			} else {
				barWidth = YOKUL.chartTypes.bar.defaults.barWidth;
			}

			// betweenBars
			if(split.length > 1) {
				betweenBars = parseInt(split[1], 10);
				if(isNaN(betweenBars)) {
					betweenBars = YOKUL.chartTypes.bar.defaults.betweenBarWidth;
				}
			} else if(barWidth === 'a') {
				betweenBars = undefined;
			} else {
				betweenBars = YOKUL.chartTypes.bar.defaults.betweenBarWidth;
			}

			// betweenGroups
			if(split.length > 2) {
				betweenGroups = parseInt(split[2], 10);
				if(isNaN(betweenGroups)) {
					betweenGroups = YOKUL.chartTypes.bar.defaults.betweenGroupWidth;
				}
			} else if(barWidth === 'a') {
				betweenGroups = undefined;
			} else {
				betweenGroups = YOKUL.chartTypes.bar.defaults.betweenGroupWidth;
			}

			this._chartSpacing = new YOKUL.BarSpacing(barWidth, betweenBars, betweenGroups);
		},

		chco: function Parser_chco(value) {
			var split = value.split(',');

			var colors = [];
			for(var i = 0; i < split.length; ++i) {
				colors.push("#" + split[i]);
			}

			this._seriesColors = colors;
		},

		chds: function Parser_chds(value) {
			var split = value.split(',');
			var ranges = [];

			for(var i = 0; i < split.length; i += 2) {
				var min = parseFloat(split[i]);
				var max = parseFloat(split[i+1]);
				ranges.push( { min: min, max: max });
			}

			this._seriesRanges = ranges;
		},

		chdl: function Parser_chdl(value) {
			var labels = value.split('|');
			this._legendLabels = labels;
		},

		chxt: function Parser_chxt(value) {
			this._visibleAxes = value.split(',');
		},

		chxr: function Parser_chxr(value) {
			var split = value.split('|');

			var ranges = [];

			for(var i = 0; i < split.length; ++i) {
				var vals = split[i].split(',');
				var index = parseInt(vals[0], 10);
				vals = vals.splice(1);

				var range = [];
				for(var k = 0; k < vals.length; ++k) {
					range.push(parseFloat(vals[k]));
				}

				ranges[index] = range;
			}

			this._axisRanges = ranges;
		},

		chxl: function Parser_chxl(value) {
			var split = value.split('|');

			var axisLabels = {};
			var currentAxis = null;

			for(var i = 0; i < split.length; ++i) {
				var value = split[i];
				if(value.indexOf(':') > -1) {
					var axisNumber = parseInt(value, 10);
					axisLabels['axis' + axisNumber] = [];
					currentAxis = axisLabels['axis' + axisNumber];
				} else {
					if(!currentAxis) {
						throw new Error("chxl: invalid value string: " + value);
					}
					currentAxis.push(value);
				}
			}

			this._axisLabels = axisLabels;
		},

		chg: function Parser_chg(value) {
			var split = value.split(',');
			this._gridSpacing = new YOKUL.GridSpacing(split[0], split[1], split[2], split[3], split[4], split[5]);
		}
	};

	var _unsupportedParameters = [ 'chem', 'chfd', 'chm', 'chxtc', 'chxp' ];

	function _isUnsupported(key) {
		for(var i = 0; i < _unsupportedParameters.length; ++i) {
			if(_unsupportedParameters[i] === key) {
				return true;
			}
		}

		return false;
	}

	var _parse = function Parser_parse(input) {
		var tokenizer = new YOKUL.Tokenizer(input);

		while(tokenizer.moveNext()) {
			var token = tokenizer.current();
			YOKUL.log.info("token-> " + token.key);

			if(_isUnsupported(token.key)) {
				YOKUL.log.warning(token.key + ": not currently supported, skipping");
				continue;
			}

			var handler = _handlers[token.key];

			if(handler === undefined) {
				YOKUL.log.error("unknown token encountered: " + token.key);
			} else {
				try {
					handler.call(this, unescape(token.value));
				} catch(err) {
					YOKUL.log.error("error during handler of: " + token.key + "::: " + err.toString());
				}
			}
		}
	};

	return function Parser(input) {
		if(input === undefined || input === null || input.length === 0) {
			throw new Error("Parser: given no input to parse");
		}

		_parse.call(this, input);
	};
})();

YOKUL.Parser.prototype._groupChartData = function _Parser_groupChartData() {
	// group count is equal to the longest series
	var groupCount = Number.MIN_VALUE;
	var data = this._chartDataBySeries;

	for(var i = 0; i < data.length; i += 1) {
		if(data[i].length > groupCount) {
			groupCount = data[i].length;
		}
	}

	var groupedData = [];

	for(var i = 0; i < groupCount; i += 1) {
		var curGroup= [];
		for(var k = 0; k < data.length; k += 1) {
			curGroup.push(data[k][i]);
		}
		groupedData.push(curGroup);
	}

	return groupedData;
};

YOKUL.Parser.prototype.size = function Parser_size() {
	return this._size;
};

YOKUL.Parser.prototype.chartType = function Parser_chartType() {
	return this._chartType;
};

YOKUL.Parser.prototype.getDataEncodingType = function Parser_getDataEncodingType() {
	return this._dataEncodingType;
};

YOKUL.Parser.prototype.chartDataBySeries = function Parser_chartDataBySeries() {
	return this._chartDataBySeries;
};

YOKUL.Parser.prototype.chartDataGrouped = function Parser_chartDataGrouped() {
	if(this._chartDataGrouped === undefined) {
		this._chartDataGrouped = this._groupChartData();
	}

	return this._chartDataGrouped;
};

YOKUL.Parser.prototype.title = function Parser_title() {
	return this._title;
};

YOKUL.Parser.prototype.titleStyle = function Parser_titleStyle() {
	return this._titleStyle;
};

YOKUL.Parser.prototype.chartSpacing = function Parser_chartSpacing() {
	if(!this._chartSpacing) {
		this._chartSpacing = new YOKUL.BarSpacing();
	}

	return this._chartSpacing;
};

YOKUL.Parser.prototype.hasGridSpacing = function Parser_hasGridSpacing() {
	return !!(this._gridSpacing);
};

YOKUL.Parser.prototype.gridSpacing = function Parser_gridSpacing() {
	return this._gridSpacing;
};

YOKUL.Parser.prototype.seriesRanges = function Parser_seriesRanges() {
	return this._seriesRanges;
};

YOKUL.Parser.prototype.legendLabels = function Parser_legendLabels() {
	return this._legendLabels;
};

YOKUL.Parser.prototype.seriesColors = function Parser_seriesColors() {
	return this._seriesColors;
};

YOKUL.Parser.prototype.visibleAxes = function Parser_visibleAxes() {
	if(!this._visibleAxes) {
		this._visibleAxes = [];
	}

	return this._visibleAxes;
};

YOKUL.Parser.prototype.axisRanges = function Parser_axisRanges() {
	return this._axisRanges;
};

YOKUL.Parser.prototype.visibleAxesCount = function Parser_visibleAxesCount(axisName) {
	var visibleAxes = this.visibleAxes();
	var count = 0;
	for(var i = 0, l = visibleAxes.length; i < l; ++i) {
		if(visibleAxes[i] === axisName) {
			++count;
		}
	}

	return count;
};

YOKUL.Parser.prototype.axisLabels = function Parser_axisLabels() {
	return this._axisLabels;
};

YOKUL.Parser.prototype.legendSpecified = function Parser_legendSpecified() {
	return !!(this._legendLabels);
};
