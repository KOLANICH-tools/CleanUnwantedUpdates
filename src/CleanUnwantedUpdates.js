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

var configSchema = JSON.parse(readFromFile(rootFolder + "/schemas/config.schema.json"));
var configName = rootFolder + "/config.json";
var debugUpdatesFile = rootFolder + "/updates.json";
var docFile = rootFolder + "/Readme.md";

function main() {
	WScript.Echo("WHS Unwanted Updates Detector and Cleaner\nThis is free software, feel free to modify and redistribute.\nhttps://github.com/KOLANICH/CleanUnwantedUpdates");
	try {
		var config = JSON.parse(readFromFile(configName));
	} catch (err) {
		WScript.Echo("Error parsing config");
		return;
	}
	var res = JSONSchema.validate(config, configSchema);
	if (!res.valid) {
		WScript.Echo(JSON.stringify(res));
		for (var i = 0; i < res.errors.length; ++i) {
			WScript.Echo(res.errors[i].property + " -> " + res.errors[i].message);
		}
		return;
	}
	rerunWithDesiredEnvironment("cscript.exe", !config.debug);

	var uninstall = config.uninstall,
	hide = config.hide;
	if (config.debug) {
		uninstall = false;
		hide = false;
	}

	WScript.Echo("Current config:\n" + JSON.stringify(config, null, "\t"));
	function updatesToDescrs(updates) {
		var descrs = [];
		for (var i = 0; i < updates.length; i++) {
			
			
			descrs.push(updateToDescr(updates[i]));
		}
		return descrs;
	}
	function updateToDescr(upd){
		var descr = "{" + upd.id + "} ";
		for (var kb in upd.kbs) {
			descr += "KB" + kb + " ";
		}
		descr += "| " + upd.title + " [ " + upd.urls.join(" ") + " ]";
		return descr;
	}
	var updates;
	var updater = new MSUpdater();
	updater.session.UserLocale = 0x0409; //en-us
	var updatesQuery = "IsHidden=1 OR IsHidden=0";
	if (!config.debug) {
		WScript.Echo("Getting list of updates...");
		updates = updater.getUpdates(updatesQuery, config.online);
	} else {
		if (fs.FileExists(debugUpdatesFile)) {
			updates = JSON.parse(readFromFile(debugUpdatesFile));
		} else {
			updates = updater.getUpdates(updatesQuery, config.online);
			writeToFile(debugUpdatesFile, JSON.stringify(updates));
		}
	}
	WScript.Echo(updates.length + " updates found. Filtering ....");
	res = detectUnwantedUpdates(updates, config);
	
	config.heuristics.downloadKBPages = false;
	WScript.Echo("Updating config...");
	putUpdatesToConfigList(res.heuristics.newHarmless, config.heuristics.harmless);
	putUpdatesToConfigList(res.heuristics.newUnwanted, config.heuristics.unwanted);
	writeToFile(configName, JSON.stringify(config, null, "\t"));
	
	var msg ="Detection results:\n";
	if(res.toUninstall.length)msg+="Following updates will be uninstalled" + (uninstall ? "" : " (simulation)") + ":\n\t" + updatesToDescrs(res.toUninstall).join("\n\t")+"\n";
	if(res.toHide.length)msg+="Following updates will be hidden" + (hide ? "" : " (simulation)") + ":\n\t" + updatesToDescrs(res.toHide).join("\n\t")+"\n";
	if (config.heuristics.enabled)
		msg += "The following updates look suspicious (you may want to examine them manually):\n\t" + updatesToDescrs(res.heuristics.newUnwanted).join("\n\t")+"\n";
		 + "The following updates look innocent (you may want to examine them manually):\n\t" + updatesToDescrs(res.heuristics.newHarmless).join("\n\t")+"\n";
	if (config.heuristics.showPrevious)
		msg += "Cached heuristically detected from previous launches (move them either into whitelist or into blacklist after manual check):\n\t" + updatesToDescrs(res.heuristics.known).join("\n\t");
	WScript.Echo(msg);

	if (uninstall&&res.toUninstall.length) {
		WScript.Echo("Uninstalling...");
		try{
			updater.uninstall(res.toUninstall);
			WScript.Echo("Uninstalled!");
		}catch(ex){
			WScript.Echo("Uninstallation failed"+ex.message);
		}
	}

	if (hide&&res.toHide.length) {
		WScript.Echo("Hiding...");
		var successfullyHiden=0;
		for (var i = 0; i < res.toHide.length; i++) {
			try{
				res.toHide[i].hide();
				successfullyHiden++;
			}catch(ex){
				WScript.Echo("Hiding of "+updateToDescr(res.toHide[i])+" failed"+ex.message);
			}
		}
		WScript.Echo("Hidden succesfully "+successfullyHiden+" updates, "+(res.toHide.length-successfullyHiden)+" failed !");
	}
}
function putUpdatesToConfigList(arr, list) {
	for (var i = 0; i < arr.length; ++i) {
		if (objectLength(arr[i].kbs) == 1) {
			for (var kb in arr[i].kbs) {
				list.kbs.push(Number(kb));
				break;
			}
		} else {
			list.ids.push(arr[i].id);
		}
	}
}
main();
