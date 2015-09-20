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
var rootFolder;
(function () {
	var objFile = fs.GetFile(WScript.ScriptFullName);
	rootFolder = fs.GetParentFolderName(objFile);
})();

function rerunWithDesiredEnvironment(desiredEngine, needsElevation) {
	desiredEngine=desiredEngine.toLowerCase();
	var engineName = fs.GetFileName(WScript.FullName).toLowerCase();
	var useCscript=desiredEngine=="cscript.exe";
	var relaunchNeeded = false;
	if (engineName != desiredEngine) {
		engineName = desiredEngine;
		relaunchNeeded = true;
	}
	var op;
	if (needsElevation && true !== amIElevated()) {
		op = "runas";
		relaunchNeeded = true;
	} else {
		op = null;
	}
	if (relaunchNeeded) {
		var args = "";
		for (var i = 0; i < WScript.Arguments.Count(); ++i)
			strArgs = strArgs + " " + WScript.Arguments(i);
		WScript.Quit(app.ShellExecute(shell.Environment("Process").Item("COMSPEC"),(useCscript?"/K":"/C")+engineName+' //NoLogo "' + WScript.ScriptFullName + '"' + " " + args, rootFolder, op, 10));
	}
}

function amIElevated() {
	//courtesy of John Howard (http://blogs.technet.com/b/jhoward/archive/2008/11/19/how-to-detect-uac-elevation-from-vbscript.aspx)
	//I have modified it a little
	var oExec = shell.Exec("whoami /groups");
	szStdOut = "";
	do {
		WScript.Sleep(100);
		if (!oExec.StdOut.AtEndOfStream) {
			szStdOut += oExec.StdOut.ReadAll();
		}
	} while (!oExec.Status)
	switch (oExec.ExitCode) {
	case 0:
		if (!oExec.StdOut.AtEndOfStream) {
			szStdOut += oExec.StdOut.ReadAll();
		}
		if (szStdOut.indexOf("S-1-16-12288") > -1) {
			return true
		} else {
			/*if (szStdOut.indexOf("S-1-16-8192") > -1) {
				return false
			} else {
				return null;
			}*/
			return false;
		}
		break;
	default:
		return null;
	}
}