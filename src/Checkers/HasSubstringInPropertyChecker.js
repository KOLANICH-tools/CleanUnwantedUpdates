"use strict";
/*
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
 */
function HasSubstringInPropertyChecker(list, scoreValue) {
	if (typeof scoreValue === "undefined") {
		this.scoreValue = Number.POSITIVE_INFINITY;
	} else {
		this.scoreValue = scoreValue;
	}
	this.list = list;
}
HasSubstringInPropertyChecker.prototype = new Checker();
HasSubstringInPropertyChecker.prototype.list = {};
HasSubstringInPropertyChecker.prototype.check = function (update, config, score) {
	for (var prop in this.list) { //enumerating blacklists, each blacklist corresponds to property of MSUpdate
		var bl = this.list[prop];
		var target;
		try {
			target = (prop.indexOf("get") ? update[prop] : update[prop]()).toLowerCase(); //< if the blacklist's name starts with get, we call getter. Also we make text lowercase to make case-insensitive matches.
		} catch (x) {
			//WScript.Echo("Warning: there is no property/method " + prop + " in the lib");
		}
		for (var j = 0; j < bl.blacklist.length; ++j) {
			if (target.indexOf(bl.blacklist[j]) > -1) {
				score.change(this.scoreValue);
			}
		}
	}
	return 0;
}
