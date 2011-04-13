TokenizerTest = TestCase("TokenizerTest");

var URL_ROOT = "http://charts.apis.google.com/chart";

TokenizerTest.prototype.testThrowsExceptionIfNoInputProvided = function() {	
	assertException("expected an exception since constructing without any input", function() {
		new SMARTYCHART.Tokenizer(); 
	});
};

TokenizerTest.prototype.testThrowsExceptionIfBadQueryDataProvided = function() {
	assertException("the query data in the url is bad, should throw an exception", function() {
		new SMARTYCHART.Tokenizer(URL_ROOT + "?^bogusdata^");
	});
}

TokenizerTest.prototype.testHas2Tokens = function() {
	var t = new SMARTYCHART.Tokenizer(URL_ROOT + "?chbh=a&chs=200x100");
	assertEquals("unexpected token count", 2, t.tokenCount());
};

TokenizerTest.prototype.testTokenizesCorrectly = function() {
	var t = new SMARTYCHART.Tokenizer(URL_ROOT + "?chbh=a&chs=200x100");
	assertUndefined("There should not be a current token as we haven't moved onto one yet", t.current());
	assertTrue("should have been able to move next as there should be two tokens remaining", t.moveNext());
	
	assertEquals("unexpected key found", "chbh", t.current().key);
	assertEquals("unexpected value found", "a", t.current().value);

	assertTrue("should have moved next as there should be one more token remaining", t.moveNext());
	
	assertEquals("unexpected key found", "chs", t.current().key);
	assertEquals("unexpected value found", "200x100", t.current().value);

	assertFalse("Should not return true on moveNext, as there should be no more tokens", t.moveNext());
};
