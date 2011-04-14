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
			if(value === 'a') {
				this._chartSpacing = YOKUL.chartTypes.bar.specific.automaticSpacing;
			} else {
				throw new Error("Parser::chbh: unknown value: " + value);
			}
		}
	};

	var _parse = function Parser_parse(input) {
		var tokenizer = new YOKUL.Tokenizer(input);

		while(tokenizer.moveNext()) {
			var token = tokenizer.current();
	
			var handler = _handlers[token.key];
	
			if(handler === undefined) {
				throw new Error("Unknown token found: " + token.key);
			}
	
			handler.call(this, token.value);
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

