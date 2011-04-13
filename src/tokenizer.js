
SMARTYCHART.Tokenizer = function Tokenizer(rawString) {

	if(rawString === undefined || rawString === null || rawString.length === 0) {
		throw new Error("Tokenizer: constructed without any input");
	}
	
	// move past the server and /chart if it exists, just grab the query data
	var match = /^[^?]+\?([a-zA-Z0-9=:&]+$)/.exec(rawString);

	if(match.length !== 2) {
		throw new Error("Tokenizer: found no valid query input in the raw string");
	}

	this._inputString = match[1];

	this._tokenize(this._inputString);

	this._currentIndex = -1;
};

SMARTYCHART.Tokenizer.prototype._tokenize = function Tokenizer_tokenize(input) {
	this._tokens = [];

	var params = input.split("&");

	for(var i = 0; i < params.length; ++i) {
		var param = params[i];
		var split = param.split('=');
		if(split.length !== 2) {
			throw new Error("Tokenizer: encountered unexpected input: " + param);
		}
		this._tokens.push({key: split[0], value: split[1]});
	}
};

SMARTYCHART.Tokenizer.prototype.tokenCount = function Tokenizer_tokenCount() {
	return this._tokens.length;
};

SMARTYCHART.Tokenizer.prototype.current = function Tokenizer_current() {
	return this._tokens[this._currentIndex];
};

SMARTYCHART.Tokenizer.prototype.moveNext = function Tokenizer_moveNext() {
	this._currentIndex += 1;
	return this._currentIndex < this._tokens.length;
};
