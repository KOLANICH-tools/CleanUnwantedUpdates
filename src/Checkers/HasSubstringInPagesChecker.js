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
function HasSubstringInPagesChecker(list, scoreValue) {
	if (typeof scoreValue === "undefined") {
		this.scoreValue = Number.POSITIVE_INFINITY;
	} else {
		this.scoreValue = scoreValue;
	}
	this.list=list;
	//WScript.Echo(this.list);
}
HasSubstringInPagesChecker.prototype = new Checker();
HasSubstringInPagesChecker.prototype.list = {};
HasSubstringInPagesChecker.prototype.visited = {};
HasSubstringInPagesChecker.prototype.check = function (update, config, score) { //checkes urls
	for (var kb in update.kbs) { //enumerating blacklists, each blacklist corresponds to property of MSUpdate
		if (kb in this.visited) {
			if (kb in this.visited)
				score.change(this.visited[kb]);
		} else {
			try{
				var text = null;
				try{
					text=retrieveKB(kb);
				}catch (err) {
					WScript.Echo("Failed to get info about kb"+kb+":\n"+err.message);
					score.change(Number.POSITIVE_INFINITY);
				}
				text=HTML2text(text).toLowerCase();
				//WScript.Echo(text);
				for (var j = 0; j < this.list.blacklist.length; ++j) {
					var kw = this.list.blacklist[j];
					if (text.indexOf(kw) > -1) {
						score.change(this.scoreValue);
					}
				}
				this.visited[kb] = 0;
			}finally{
				this.visited[kb] = score.score;
			}
		}
	}
	return 0;
};