YOKUL.Parser = (function() {

	var _chd_handlers = {
		t: function Parser_chd_t(value) {
			value = value.replace(/_/g, ",null,");
			
			var data = [];
			var split = value.split(',');

			for(var i = 0; i < split.length; ++i){
				var s = split[i];

				if(s !== undefined && s !== '') {
					if(s === 'null') {
						data.push(null);
					} else {
						data.push(parseInt(s, 10));
					}
				}
			}

			return data;
		}
	};

	var _handlers = {
		chs: function Parser_chs(value) {
			var split = value.split('x');
			if(split.length !== 2) {
				throw new Error("Parser:chs: unexpected input: " + value);
			}
	
			this._size = { w: parseInt(split[0], 10), h: parseInt(split[1], 10) };
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

			this._chartData = _chd_handlers[splitOnColon[0]](splitOnColon[1]);
		},

		chtt: function Parser_chtt(value) {
			this._title = value;
		},

		chbh: function Parser_chbh(value) {
			try {
				if(value === 'a') {
					this._chartSpacing = YOKUL.chartTypes.bar.specific.automaticSpacing;
				} else {
					var split = value.split(',');
					var barWidth = (split.length > 0 && parseInt(split[0], 10)) || YOKUL.chartTypes.bar.defaults.barWidth;
					var betweenBars = (split.length > 1 && parseInt(split[1], 10)) || YOKUL.chartTypes.bar.defaults.betweenBarWidth;
					var betweenGroups = (split.length > 2 && parseInt(split[2], 10)) || YOKUL.chartTypes.bar.defaults.betweenGroupWidth;

					this._chartSpacing = { barWidth: barWidth, betweenBars: betweenBars, betweenGroups: betweenGroups };
				}
			} catch(err) {
				throw new Error("Unexpected error parsing chbh: " + err.toString());
			}
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
				var min = parseInt(split[i], 10);
				var max = parseInt(split[i+1], 10);
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
		}
	};

	var _unsupportedParameters = [ 'chem', 'chfd', 'chm', 'chxtc' ];

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
	}

	return function Parser(input) {
		if(input === undefined || input === null || input.length === 0) {
			throw new Error("Parser: given no input to parse");
		}
	
		_parse.call(this, input);
	};
})();

YOKUL.Parser.prototype.size = function Parser_size() {
	return this._size;
};

YOKUL.Parser.prototype.chartType = function Parser_chartType() {
	return this._chartType;
};

YOKUL.Parser.prototype.chartData = function Parser_chartData() {
	return this._chartData;
};

YOKUL.Parser.prototype.title = function Parser_title() {
	return this._title;
};

YOKUL.Parser.prototype.chartSpacing = function Parser_chartSpacing() {
	return this._chartSpacing;
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
	return this._visibleAxes;
};

YOKUL.Parser.prototype.axisLabels = function Parser_axisLabels() {
	return this._axisLabels;
};

