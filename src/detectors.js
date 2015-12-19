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
function detectUnwantedUpdates(updates, cfg) {
	var detectors = {
		"detect" : new CheckersSet({
			"blacklisted" : new IsUpdateListedChecker(cfg.blacklist)
		}),
		"heuristic" : {
			"detect" : new CheckersSet({
				"CVEs" : new Checker(function (update, cfg, score) {
					score.change(update.cves.length ? Number.NEGATIVE_INFINITY : 0);
				}),
				"blacklistedWordsPropsHeuristic" : new HasSubstringInPropertyChecker(cfg.heuristics.propertiesKeywords)
			}),
			"known" : new CheckersSet({
				"unwanted" : new IsUpdateListedChecker(cfg.heuristics.unwanted),
				"harmless" : new IsUpdateListedChecker(cfg.heuristics.harmless)
			})
		}
	};
	if (cfg.heuristics.downloadKBPages) {
		detectors.heuristic.detect.set("blacklistedWordsWebpagesHeuristic", new HasSubstringInPagesChecker(cfg.heuristics.pagesKeywords));
	}
	if (!cfg.ignoreUpdatesWhitelist) {
		detectors.detect.set("whitelisted", new IsUpdateListedChecker(cfg.whitelist, Number.NEGATIVE_INFINITY));
	}

	var res = {
		toUninstall : [],
		toHide : [],
		whitelisted : [],
		heuristics : {
			known : [],
			newUnwanted : [],
			newHarmless : []
		}
	};
	for (var i = 0, j; i < updates.length; ++i) {
		var update = updates[i];
		//WScript.Echo("Checking "+JSON.stringify(Object.keys(update.kbs)));
		var score = detectors.detect.check(update, cfg);
		if (score < 0) {
			res.whitelisted.push(update);
			continue;
		} else if (score > 0) {
			if (update.installed) {
				res.toUninstall.push(update);
			}
			if (!update.hidden) {
				res.toHide.push(update);
			}
			continue;
		} else if (cfg.heuristics.enabled) {
			if (detectors.heuristic.known.check(update, cfg) <= 0) {
				if (detectors.heuristic.detect.check(update, cfg) > 0) {
					res.heuristics.newUnwanted.push(update);
				} else {
					res.heuristics.newHarmless.push(update);
				}
			} else
				res.heuristics.known.push(update);
		}
	}
	return res;
}
