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
var HTML2text;
(function () {
	var notNeededTags = array2Hashtable(["head", "script", "style", "svg", "iframe", "video", "audio", "picture", "canvas"]);
	var newLineTags = array2Hashtable(["br", "p", "hr", "tr", "th", "h1", "h2", "h3", "h4"]);
	HTML2text = function (html) {
		var res = "";
		var notNeeded = 0;
		//https://github.com/fb55/htmlparser2/wiki/Parser-options
		var saxParser = {
			ontext : function (text) {
				if (notNeeded == 0) {
					res += " " + text.replace(/\s+/g, " ");
				}
			},
			onopentag : function (name) {
				if (name in notNeededTags) {
					notNeeded++;
				}
				if (name in newLineTags)
					res += "\n";
			},
			onclosetag : function (name) {
				if (name in notNeededTags && notNeeded > 0) {
					notNeeded--;
				}
			}
		};
		var parser = new Parser(saxParser, {});
		parser.write(html);
		parser.end();
		//these parsers don't work with HTML, maybe sometimes they will
		/*
		//https://github.com/isaacs/sax-js
		var parser = sax.parser(false, {
		normalize : true
		});
		parser.ontext = saxParser
		parser.onopentag = function (node) {
		return saxParser.onopentag(node.name);
		};
		parser.onclosetag = function (node) {
		return saxParser.onclosetag(node.name);
		};
		parser.onerror = function (e) {
		parser.resume();
		};
		parser.write(html).close();
		 */

		/*
		//https://github.com/blowsie/Pure-JavaScript-HTML5-Parser
		HTMLParser(html, {
		start : function (tag, attrs, unary) {
		return saxParser.onopentag(tag);
		},
		end : function (tag) {
		return saxParser.onclosetag(tag);
		},
		chars : function (text) {
		return saxParser.ontext(text);
		}
		});
		 */
		return res;
	};

})();
