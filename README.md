CleanUnwantedUpdates.wsf
======================

Initially started as fork of [BlockWindows](https://github.com/WindowsLies/BlockWindows) it was lately transformed into own solution.

This solution is a set of scripts to detect updates of Microsoft™ Windows™ OS which harm users’ privacy and uninstall them.
It can be used as a submodule of BlockWindows.

End User License Agreement
========================

1. IN NO EVENT AND UNDER NO LEGAL THEORY, WHETHER IN TORT (INCLUDING NEGLIGENCE), CONTRACT, OR OTHERWISE, SHALL ANY CONTRIBUTOR BE LIABLE TO YOU FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES OF ANY CHARACTER ARISING AS A RESULT OF THIS AGREEMENT OR OUT OF THE USE OR INABILITY TO USE THE WORK (INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF GOODWILL, WORK STOPPAGE, COMPUTER FAILURE OR MALFUNCTION, OR ANY AND ALL OTHER COMMERCIAL DAMAGES OR LOSSES) OR OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE, EVEN IF SUCH CONTRIBUTOR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. YOU ARE SOLELY RESPONSIBLE FOR DETERMINING THE APPROPRIATENESS OF USING OR REDISTRIBUTING THE WORK AND ASSUME ANY RISKS ASSOCIATED WITH YOUR EXERCISE OF PERMISSIONS UNDER THIS AGGREEMENT. YOU ALSO AUTHORIZE THE SOFTWARE TO ACCESS, MODIFY, DESTROY, CREATE AND TRANSFER INFORMATION STORED IN YOUR COMPUTER.

2. Microsoft™, Windows™, Internet Explorer™, JScript™, ActiveX™ and Windows Update™ are either registered trademarks or trademarks of Microsoft Corporation in the United States and/or other countries. JavaScript™ is either registered trademark or trademark of Oracle Corporation.

3. This software uses some free ([as in “freedom”](https://www.gnu.org/philosophy/free-sw.html)) libraries by third parties. You can find them in `lib` subfolder. The license of each library is usually situated in the beginning of its file. To use this software you need to agree with them.

4. `Unwanted` means that this kind of updates **CAN** be unwanted, but **NOT** that they **ARE** such. The trivial example is when you just want an update the tool considers unwanted; the tool has no telepathic and magic abilities to know whether the update is really unwanted by you, it uses only rough heuristics. Another example is the case when there is a problem in the tool causing uninstallation and/or hiding of **WANTED** update, for example update fixing a critical security vulnerability. There is always a risk that the tool will misclassify wanted update as unwanted (the inverse is also true), if you don’t accept this risk, please, don’t use the tool.

5. The tool works noninteractively, all the control over the processing is made via configuration file (but you can try `^c` to stop execution of them at your own risk). This means that the tool won’t ask you before uninstallation/hiding of updates, so there is a risk it can uninstall/hide the update you don’t want to be uninstalled/hidden without asking your permission to do so. You grant the tool such permission when you start using it. If you don’t, please, don’t use the tool.

6. The tool uses [Windows Script Host](https://en.wikipedia.org/wiki/Windows_Script_Host), which is a very old technology and based on [IE6](https://en.wikipedia.org/wiki/IE6) [JScript](https://en.wikipedia.org/wiki/JScript) engine and [ActiveX](https://en.wikipedia.org/wiki/ActiveX) components. They have not been updated for a while and can contain critical security vulnerabilities. Though we have taken some mitigation measures like using pure JS implementations of a HTML parser instead of the ActiveX one, the risk of being hacked by remote attacker (for example the one who makes [MiTM](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) on your connection to MS site, or the one, who has hacked MS site) still persists, if you don’t accept the risk, please, don’t use the tool.

7. This tool downloads webpages from Microsoft website in order to analyze them to detect whether the update is unwanted. Please don’t keep this option constantly enabled because I (and I’m sure most of yours too, because the MS site is the main source of information about updates, it’d be stupid to overload such a site) don’t want Microsoft’s site being overloaded. If you want to debug this tool, please use some caching proxy (like [Fiddler](http://www.telerik.com/fiddler) with [AutoResponder](http://docs.telerik.com/fiddler/KnowledgeBase/AutoResponder)) ([set proxy](https://msdn.microsoft.com/ru-ru/library/windows/desktop/aa384059.aspx) in `util.js` file in functions `retrieveKB` and `retrievePage`).

8. **At the moment there are problems in the tool: when given incorrect UTF-8 it behaves incorrectly and crashes with uncaught exception because of a trouble in WinHttpRequest. Use branch [```fixing-WinHttpRequest```](https://github.com/KOLANICH/CleanUnwantedUpdates/tree/fixing-WinHttpRequest) as a temporary solution. The abilities to detect unwanted updates are limited to the pages containing only valid Unicode. If you have any ideas how to bypass this issue, please, either create an PR or write the ideas to [#1](https://github.com/KOLANICH/CleanUnwantedUpdates/issues/1).**

How-to use
==========

Basic usage
-----------

To use it just launch its `*.WSF` file (`CleanUnwantedUpdates.wsf`) with `cscript.exe` from elevated command prompt. In fact you can launch it with `wscript.exe` (default doubleclick action in most of systems) and even not from elevated shell, in this case it will restart itself with the needed environment (elevated `cscript.exe`).
The default configuration file (`config.json`) is suitable for the ones who want to quickly disable unwanted updates.
The description and documentation of configuration file in [JSON Schema](http://json-schema.org/) format you can see in `schemas` folder (see [config.schema.json file](./schemas/config.schema.json)).

Advanced usage
--------------

Also you can allow the tool heuristically detect unwanted updates. To do this you need to enable `heuristics.enable` in configuration file. When heuristic is enabled, the tool cached heuristically detected files into configuration file to prevent their reevaluation and, allow you easily get their list and easily white/blacklist them.

WARNING: If you use it in non-english system, when `offline` is true, MS Update may provide localised strings for updates, which should cause false negatives. If you wanna use it offline, you should add localized keywords to the keywords.

To allow the tool download pages from MS site use `heuristics.downloadKBPages`. To show info about cached heuristically detected updates use `heuristics.showPrevious`. To make debugging faster use `heuristics.debug` which will cause info about updates being cached into into `updates.json` file and loaded from that cache.

Hacking
=======

The folder structure is following

* `CleanUnwantedUpdates.wsf` - A file with metainformation binding different files into the tool. You should launch it.
* `config.json` - a configuration file. [The documentation](/schemas/config.schema.json).
* `lib\` - is for libraries not written specially for this project, but needed for it.
* `src\` - code written specially for this project, but of course you can reuse it
	* `CleanUnwantedUpdates.js` - the main app file responsible for the tool main workflow and interface
	* `utils.js` - defines different functions and initializes objects without which nothing works.
	* `PrepareEnvironment.js` - responsible for environment preparation: folder detection, WSH environment detection, restarting the script in needed WSH environment with needed privileges
	* `libMSUpdater.js` - allow to mess with Microsoft Update from JavaScript without butthurt
	* `libHTML2Text.js` - converts HTML to text
	* `detectors.js` - contains detecting logic built upon the framework
	* `Score.js` - A framework class representing score. Call `score.change(n)` to increase score by `n`. When threshold exceeded the update is classified either as unwanted or as harmless or as unknown. The semantics is the responsibility of the programmer.
 * `Checkers/` - contains the classes used to check whether the update is unwanted. The convention is following: the higher the score, the more signs of detection.
	* `Checker.js` - base class defining interface.
	* `CheckersSet.js` - A group of checkers. Checkers usually should be used inside of group.
	* `IsUpdateListedChecker.js` - Checks the presence of update in a list.
	* `HasSubstringInPropertyChecker.js` - Checks presence of values from the list in updates’ properties.
	* `HasSubstringInPagesChecker.js` - Checks presence of values from the list in updates KB page.
* `schemas/` - contains [JSON Schema](http://json-schema.org/) descriptions of different interfaces and configuration files. You should assume they are validated with respect to schemas.
	* `config.schema.json` - description and documentation of/on the configuration file format.

Thoughts, advices and warnings
------------------------------

* WSH is an old technology, it does’t support even ECMAScript5 and it is very uncomfortable to debug. I’d be better if MS updated this, but it seems they won’t. I’ve googled a bit, and found some post about using Chakra engine, but to use it you it need it to be hosted on an app compiled for .net.
* ActiveX is also a terrible and obsolete technology, use it very careful, especially with remote data.
* You can easily add a new heuristic. To do this you need
 * Create a class extending `Checker` class. Constructor should initialize an instance, check should make check. When you make check, to report about the results of this check you need to modify the score. The `Score` class checks if the thresholds have been exceeded, and if they have it throws the exception, which is caught by `CheckersSet` class.
 * Create new instances, wrap them into `CheckersSet`s.
 * Call `CheckersSet.check` and process the value returned.
* Set `debug` in config.json to `true` to make the tool to cache the updates into `updates.json`, which will lower the latency of each tool launch. Use it only while debugging because it will use obsolete data. 