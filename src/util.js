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
var shell = new ActiveXObject("WScript.Shell"), fs = new ActiveXObject("Scripting.FileSystemObject"), app = new ActiveXObject("Shell.Application");

function readFromFile(fn) { //<reads text from file and puts into JS string
	fn = fs.OpenTextFile(shell.ExpandEnvironmentStrings(fn), 1, false);
	var text = fn.ReadAll();
	fn.Close();
	return text;
}
function writeToFile(fn, text) { //<reads text from file and puts into JS string
	fn = fs.CreateTextFile(shell.ExpandEnvironmentStrings(fn), true);
	fn.Write(text);
	fn.Close();
}

function array2Hashtable(arr) {
	var hash = {};
	for (var i = 0; i < arr.length; ++i) {
		hash[arr[i]] = null;
	}
	return hash;
}

if (!("keys" in Object)) {
	Object.keys = function (obj) {
		var arr = [];
		for (var i in obj) {
			arr.push(i);
		}
		return arr;
	};
}
var hashtable2Array = Object.keys;

function retrievePage(url) {
	var whr;
	try {
		whr = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		whr.Open("GET", url, false);
		whr.SetRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; rv:40.0) Gecko/20100101 Firefox/40.0");
		whr.SetRequestHeader("Accept-Language", "q=0.6,en-US;q=0.4,en;q=0.2");
		whr.SetRequestHeader("DNT", "1");
		whr.Send();
	} catch (err) {
		return null;
	}
	return whr.ResponseText;
}
function retrieveKB(kb) { //we have to use this function instead of links provided by MS because on MS site info is loaded through ajax
	var whr;
	try {
		whr = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
		whr.Open("GET", "https://support.microsoft.com/api/content/kb/" + kb, false);
		whr.SetRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; rv:40.0) Gecko/20100101 Firefox/40.0");
		whr.SetRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
		whr.SetRequestHeader("Accept-Language", "q=0.6,en-US;q=0.4,en;q=0.2");
		whr.SetRequestHeader("Accept-Encoding", "gzip, deflate");
		whr.SetRequestHeader("DNT", "1");
		whr.SetRequestHeader("Referer", "https://support.microsoft.com/en-us/kb/" + kb);
		whr.SetRequestHeader("Cache-Control", "max-age=0");
		whr.Send();
	} catch (err) {
		return null;
	}
	return whr.ResponseText;
}
function objectLength(obj) {
	var i = 0;
	for (var a in obj)
		i++;
	return i;
}
