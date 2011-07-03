
YOKUL.Tokenizer = function Tokenizer(rawString) {

	if(rawString === undefined || rawString === null || rawString.length === 0) {
		throw new Error("Tokenizer: constructed without any input");
	}
	
	// move past the server and /chart if it exists, just grab the query data
	var match = /^[^?]+\?(.+)$/.exec(rawString);

	if(!match || match.length !== 2) {
		throw new Error("Tokenizer: found no valid query input in the raw string: " + rawString);
	}

	this._inputString = match[1];

	this._tokenize(this._inputString);

	this._currentIndex = -1;
};

YOKUL.Tokenizer.prototype._tokenize = function Tokenizer_tokenize(input) {
	this._tokens = [];

	var params = input.split("&");

	for(var i = 0; i < params.length; ++i) {
		var param = params[i];

		if(!param || param.length === 0 || param.match(/^[ \t]$/)) {
			continue;
		}

		var split = param.split('=');

		if(split.length !== 2) {
			throw new Error("Tokenizer: encountered unexpected input: %%" + param + "%%");
		}
		this._tokens.push({key: split[0], value: split[1]});
	}
};

YOKUL.Tokenizer.prototype.tokenCount = function Tokenizer_tokenCount() {
	return this._tokens.length;
};

YOKUL.Tokenizer.prototype.current = function Tokenizer_current() {
	return this._tokens[this._currentIndex];
};

YOKUL.Tokenizer.prototype.moveNext = function Tokenizer_moveNext() {
	this._currentIndex += 1;
	return this._currentIndex < this._tokens.length;
};
