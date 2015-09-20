CleanMaliciousUpdates
====================
Initially started as fork of [BlockWindows](https://github.com/WindowsLies/BlockWindows) it was lately transformed into own solution.

This solution is a set of scripts to detect updates of Microsoft (TM) Windows (TM) OS which harm users' privacy and uninstall them.
It can be used as a submodule of BlockWindows.

End User License Aggreement
=========================
1.  IN NO EVENT AND UNDER NO LEGAL THEORY, WHETHER IN TORT (INCLUDING NEGLIGENCE), CONTRACT, OR OTHERWISE, SHALL ANY CONTRIBUTOR BE LIABLE TO YOU FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES OF ANY CHARACTER ARISING AS A RESULT OF THIS AGGREEMENT OR OUT OF THE USE OR INABILITY TO USE THE WORK (INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF GOODWILL, WORK STOPPAGE, COMPUTER FAILURE OR MALFUNCTION, OR ANY AND ALL OTHER COMMERCIAL DAMAGES OR LOSSES) OR OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE, EVEN IF SUCH CONTRIBUTOR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. YOU ARE SOLELY RESPONSIBLE FOR DETERMINING THE APPROPRIATENESS OF USING OR REDISTRIBUTING THE WORK AND ASSUME ANY RISKS ASSOCIATED WITH YOUR EXERCISE OF PERMISSIONS UNDER THIS AGGREEMENT. YOU ALSO AUTHORIZE THE SOFTWARE TO ACCESS, MODIFY, DESTROY, CREATE AND TRANSFER INFORMATION STORED IN YOUR COMPUTER.


2. Microsoft, Windows, Internet Explorer, JScript, ActiveX and Windows Update are either registered trademarks or trademarks of Microsoft Corporation in the United States and/or other countries. JavaScript is either registered trademark or trademark of Oracle Corporation.

3. This software uses some free (as in "freedom") libraries by third parties. You can find them in ```lib``` subfolder. The license of each library is usually situated in the beginning of its file. To use this software you need to aggree with them.

4. ```Unwanted``` means that this kind of updates CAN be unwanted. There can be a problem in the tool causing uninstallation and/or hiding of *WANTED* update, for example update fixing a critical security vulnerability. This is a risk, if you don't accept it, please, don't use the tool.

5. The tool works noninteractively, all the control is made via config. This means that the tool won't ask you before uninstallation/hiding of updates, so there is a risk it cn uninstall/hide the update you don't want to be uninstalled/hidden, if you don't accept it, please, don't use the tool.

6. The tool uses Windows Script Host, which is a very old technology and which is based on IE6 JScript engine and ActiveX components. They have not been updated for a while and can contain security vulnerabilities. Although we have taken some mitigation measures like using pure JS implementation of HTML parser instead of ActiveX one, the risk still persist, if you don't accept it, please, don't use the tool.

7. This tool downloads webpages from Microsoft website in order to analyse them to detect whether the update unwanted. Please don't keep this option constantly enabled, because I don't want Microsoft's site being overloaded. If you want to debug this tool, please use some caching proxy (set proxy in ```util.js``` file in functions ```retrieveKB``` and ```retrieveKB```).

How-to use
==========
Basic usage
----------
To use it just launch its ```*.WSF``` file (```CleanUnwantedUpdates.wsf```) with ```cscript.exe```.
The default config file (```config.json```) is suitable for the ones who want to quickly disable unwanted.
The description and documentation of config file in [JSON Schema](http://json-schema.org/) format you can see in ```schemas``` folder (see ```config.schema.json``` file).

Advanced usage
---------------
Also you can allow the tool heuristically detect unwanted updates. To do this you need to enable ```heuristics.enable``` in config.
To allow the tool download pages from MS site use ```heuristics.downloadKBPages```. To show info about cached heuristically detected updates use ```heuristics.showPrevious```. To make debugging faster use ```heuristics.debug``` which will cache info about updates into ```updates.json``` file.