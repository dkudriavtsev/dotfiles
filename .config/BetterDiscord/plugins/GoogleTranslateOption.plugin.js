//META{"name":"GoogleTranslateOption","website":"https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/GoogleTranslateOption","source":"https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Plugins/GoogleTranslateOption/GoogleTranslateOption.plugin.js"}*//

class GoogleTranslateOption {
	getName () {return "GoogleTranslateOption";}

	getVersion () {return "1.7.6";} 

	getAuthor () {return "DevilBro";}

	getDescription () {return "Adds a Google Translate option to your context menu, which shows a preview of the translated text and on click will open the selected text in Google Translate. Also adds a translation button to your textareas, which will automatically translate the text for you before it is being send.";}

	constructor () {
		this.changelog = {
			"improved":[["Embeds","Translating a message now also translates the embed descriptions (usually the maintext of embeds)"]]
		};

		this.labels = {};

		this.patchModules = {
			"ChannelTextArea":"componentDidMount",
			"Message":"componentDidMount",
			"MessageContent":"componentDidMount",
			"StandardSidebarView":"componentWillUnmount"
		};
	}

	initConstructor () {
		this.languages = {};

		this.doTranslate = false;
		this.translating = false;

		this.brailleConverter = {
			"0":"⠴", "1":"⠂", "2":"⠆", "3":"⠒", "4":"⠲", "5":"⠢", "6":"⠖", "7":"⠶", "8":"⠦", "9":"⠔", "!":"⠮", "\"":"⠐", "#":"⠼", "$":"⠫", "%":"⠩", "&":"⠯", "'":"⠄", "(":"⠷", ")":"⠾", "*":"⠡", "+":"⠬", ",":"⠠", "-":"⠤", ".":"⠨", "/":"⠌", ":":"⠱", ";":"⠰", "<":"⠣", "=":"⠿", ">":"⠜", "?":"⠹", "@":"⠈", "a":"⠁", "b":"⠃", "c":"⠉", "d":"⠙", "e":"⠑", "f":"⠋", "g":"⠛", "h":"⠓", "i":"⠊", "j":"⠚", "k":"⠅", "l":"⠇", "m":"⠍", "n":"⠝", "o":"⠕", "p":"⠏", "q":"⠟", "r":"⠗", "s":"⠎", "t":"⠞", "u":"⠥", "v":"⠧", "w":"⠺", "x":"⠭", "y":"⠽", "z":"⠵", "[":"⠪", "\\":"⠳", "]":"⠻", "^":"⠘", "⠁":"a", "⠂":"1", "⠃":"b", "⠄":"'", "⠅":"k", "⠆":"2", "⠇":"l", "⠈":"@", "⠉":"c", "⠊":"i", "⠋":"f", "⠌":"/", "⠍":"m", "⠎":"s", "⠏":"p", "⠐":"\"", "⠑":"e", "⠒":"3", "⠓":"h", "⠔":"9", "⠕":"o", "⠖":"6", "⠗":"r", "⠘":"^", "⠙":"d", "⠚":"j", "⠛":"g", "⠜":">", "⠝":"n", "⠞":"t", "⠟":"q", "⠠":", ", "⠡":"*", "⠢":"5", "⠣":"<", "⠤":"-", "⠥":"u", "⠦":"8", "⠧":"v", "⠨":".", "⠩":"%", "⠪":"[", "⠫":"$", "⠬":"+", "⠭":"x", "⠮":"!", "⠯":"&", "⠰":";", "⠱":":", "⠲":"4", "⠳":"\\", "⠴":"0", "⠵":"z", "⠶":"7", "⠷":"(", "⠸":"_", "⠹":"?", "⠺":"w", "⠻":"]", "⠼":"#", "⠽":"y", "⠾":")", "⠿":"=", "_":"⠸"
		};

		this.morseConverter = {
			"0":"−−−−−", "1":"·−−−−", "2":"··−−−", "3":"···−−", "4":"····−", "5":"·····", "6":"−····", "7":"−−···", "8":"−−−··", "9":"−−−−·", "!":"−·−·−−", "\"":"·−··−·", "$":"···−··−", "&":"·−···", "'":"·−−−−·", "(":"−·−−·", ")":"−·−−·−", "+":"·−·−·", ",":"−−··−−", "-":"−····−", ".":"·−·−·−", "/":"−··−·", ":":"−−−···", ";":"−·−·−·", "=":"−···−", "?":"··−−··", "@":"·−−·−·", "a":"·−", "b":"−···", "c":"−·−·", "d":"−··", "e":"·", "f":"··−·", "g":"−−·", "h":"····", "i":"··", "j":"·−−−", "k":"−·−", "l":"·−··", "m":"−−", "n":"−·", "o":"−−−", "p":"·−−·", "q":"−−·−", "r":"·−·", "s":"···", "t":"−", "u":"··−", "v":"···−", "w":"·−−", "x":"−··−", "y":"−·−−", "z":"−−··", "·":"e", "··":"i", "···":"s", "····":"h", "·····":"5", "····−":"4", "···−":"v", "···−··−":"$", "···−−":"3", "··−":"u", "··−·":"f", "··−−··":"?", "··−−·−":"_", "··−−−":"2", "·−":"a", "·−·":"r", "·−··":"l", "·−···":"&", "·−··−·":"\"", "·−·−·":"+", "·−·−·−":".", "·−−":"w", "·−−·":"p", "·−−·−·":"@", "·−−−":"j", "·−−−−":"1", "·−−−−·":"'", "−":"t", "−·":"n", "−··":"d", "−···":"b", "−····":"6", "−····−":"-", "−···−":"=", "−··−":"x", "−··−·":"/", "−·−":"k", "−·−·":"c", "−·−·−·":";", "−·−·−−":"!", "−·−−":"y", "−·−−·":"(", "−·−−·−":")", "−−":"m", "−−·":"g", "−−··":"z", "−−···":"7", "−−··−−":",", "−−·−":"q", "−−−":"o", "−−−··":"8", "−−−···":":", "−−−−·":"9", "−−−−−":"0", "_":"··−−·−"
		};

		this.defaults = {
			settings: {
				addTranslateButton:		{value:true, 		description:"Adds an translate button to the chatbar."},
				sendOriginalMessage:	{value:false, 		description:"Send the original message together with the translation."}
			},
			choices: {
				inputContext:			{value:"auto", 		place:"Context", 		direction:"Input",		popout:false, 		description:"Input Language in selected Messages:"},
				outputContext:			{value:"$discord", 	place:"Context", 		direction:"Output",		popout:false, 		description:"Output Language in selected Messages:"},
				inputMessage:			{value:"auto", 		place:"Message", 		direction:"Input",		popout:true, 		description:"Input Language in your Message:"},
				outputMessage:			{value:"$discord", 	place:"Message", 		direction:"Output",		popout:true, 		description:"Output Language in your Message:"}
			}
		};

		this.translateButtonMarkup = 
			`<button type="button" class="${BDFDB.disCNS.textareabuttonwrapper + BDFDB.disCNS.button + BDFDB.disCNS.buttonlookblank + BDFDB.disCNS.buttoncolorbrand + BDFDB.disCN.buttongrow} translate-button">
				<div class="${BDFDB.disCNS.buttoncontents + BDFDB.disCNS.textareabutton + BDFDB.disCN.textareapickerbutton}">
					<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="${BDFDB.disCN.textareaicon}" viewBox="0 0 22 22" fill="currentColor">
						<path d="M 19.794, 3.299 H 9.765 L 8.797, 0 h -6.598 C 0.99, 0, 0, 0.99, 0, 2.199 V 16.495 c 0, 1.21, 0.99, 2.199, 2.199, 2.199 H 9.897 l 1.1, 3.299 H 19.794 c 1.21, 0, 2.199 -0.99, 2.199 -2.199 V 5.498 C 21.993, 4.289, 21.003, 3.299, 19.794, 3.299 z M 5.68, 13.839 c -2.48, 0 -4.492 -2.018 -4.492 -4.492 s 2.018 -4.492, 4.492 -4.492 c 1.144, 0, 2.183, 0.407, 3.008, 1.171 l 0.071, 0.071 l -1.342, 1.298 l -0.066 -0.06 c -0.313 -0.297 -0.858 -0.643 -1.671 -0.643 c -1.441, 0 -2.612, 1.193 -2.612, 2.661 c 0, 1.468, 1.171, 2.661, 2.612, 2.661 c 1.507, 0, 2.161 -0.962, 2.337 -1.606 h -2.43 v -1.704 h 4.344 l 0.016, 0.077 c 0.044, 0.231, 0.06, 0.434, 0.06, 0.665 C 10.001, 12.036, 8.225, 13.839, 5.68, 13.839 z M 11.739, 9.979 h 4.393 c 0, 0 -0.374, 1.446 -1.715, 3.008 c -0.588 -0.676 -0.995 -1.336 -1.254 -1.864 h -1.089 L 11.739, 9.979 z M 13.625, 13.839 l -0.588, 0.583 l -0.72 -2.452 C 12.685, 12.63, 13.13, 13.262, 13.625, 13.839 z M 20.893, 19.794 c 0, 0.605 -0.495, 1.1 -1.1, 1.1 H 12.096 l 2.199 -2.199 l -0.896 -3.041 l 1.012 -1.012 l 2.953, 2.953 l 0.803 -0.803 l -2.975 -2.953 c 0.99 -1.138, 1.759 -2.474, 2.106 -3.854 h 1.397 V 8.841 H 14.697 v -1.144 h -1.144 v 1.144 H 11.398 l -1.309 -4.443 H 19.794 c 0.605, 0, 1.1, 0.495, 1.1, 1.1 V 19.794 z"/>
					</svg>
				</div>
			</button>`;

		this.reverseButtonMarkup = 
			`<svg class="reverse-button ${BDFDB.disCN.flexchild}" type="REPLACETYPE" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" style="flex: 0 0 auto;">
				 <path d="M 0, 10.515 c 0, 2.892, 1.183, 5.521, 3.155, 7.361 L 0, 21.031 h 7.887 V 13.144 l -2.892, 2.892 C 3.549, 14.722, 2.629, 12.75, 2.629, 10.515 c 0 -3.418, 2.235 -6.309, 5.258 -7.492 v -2.629 C 3.418, 1.577, 0, 5.652, 0, 10.515 z M 21.031, 0 H 13.144 v 7.887 l 2.892 -2.892 C 17.482, 6.309, 18.402, 8.281, 18.402, 10.515 c 0, 3.418 -2.235, 6.309 -5.258, 7.492 V 20.768 c 4.469 -1.183, 7.887 -5.258, 7.887 -10.121 c 0 -2.892 -1.183 -5.521 -3.155 -7.361 L 21.031, 0 z"/>
			</svg>`;

		this.translatePopoutMarkup = 
			`<div class="${BDFDB.disCNS.popout + BDFDB.disCNS.popoutbottomright + BDFDB.disCNS.popoutnoarrow + BDFDB.disCN.popoutnoshadow} popout-googletranslate BDFDB-modal" style="z-index: 1000; overflow: visible; visibility: visible; transform: translateX(-100%) translateY(-100%) translateZ(0px);">
				<div class="${BDFDB.disCN.popoutthemedpopout}">
					<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.horizontal + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCNS.margintop8 + BDFDB.disCN.marginbottom8}" style="flex: 1 1 auto;">
						<h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.marginreset + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCNS.height24 + BDFDB.disCN.flexchild}" style="flex: 1 1 auto;">Words starting with "!" will be ignored</h3>
					</div>
					${Object.keys(this.defaults.choices).map((key, i) => 
					`<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.horizontal + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCNS.margintop8 + BDFDB.disCN.marginbottom8}" style="flex: 1 1 auto;">
						<h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCN.flexchild}" style="flex: 1 1 auto;">${this.defaults.choices[key].description}</h3>
						${this.defaults.choices[key].direction == "Output" ? this.reverseButtonMarkup.replace("REPLACETYPE",key) : ""}
					</div>
					<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.horizontal + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.marginbottom8}" style="flex: 1 1 auto;">${BDFDB.createSelectMenu(`<div class="${BDFDB.disCNS.title + BDFDB.disCNS.medium + BDFDB.disCNS.primary + BDFDB.disCNS.weightnormal + BDFDB.disCN.cursorpointer}" style="flex: 1 1 auto;"></div>`, this.defaults.choices[key].value, key)}</div>`).join("")}
					<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.horizontal + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.marginbottom8}" style="flex: 1 1 auto;">
						<h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.marginreset + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCNS.height24 + BDFDB.disCN.flexchild}" style="flex: 1 1 auto;">Translate:</h3>
						<div class="${BDFDB.disCNS.flexchild + BDFDB.disCNS.switchenabled + BDFDB.disCNS.switch + BDFDB.disCNS.switchvalue + BDFDB.disCNS.switchsizedefault + BDFDB.disCNS.switchsize + BDFDB.disCNS.switchthemedefault + BDFDB.disCN.switchvalueunchecked}" style="flex: 0 0 auto;">
							<input type="checkbox" class="${BDFDB.disCNS.switchinnerenabled + BDFDB.disCN.switchinner}" id="translating-checkbox">
						</div>
					</div>
				</div>
			</div>`;

		this.css = `
			${BDFDB.dotCNS.textareawrapall + BDFDB.dotCN.textareainner} {
				align-items: center;
			}
			${BDFDB.dotCNS.textareawrapall + BDFDB.dotCN.textareainner} .send-button {
				top: 0;
				bottom: 0;
				right: 9px;
			}
			${BDFDB.dotCN.textareabuttonwrapper}.translate-button.translating-active ${BDFDB.dotCN.textareaicon} {
				color: #F04747 !important;
			}
			.reverse-button {
				margin-top: -5px;
				opacity: 0.2;
				transition: all 200ms ease;
			}
			${BDFDB.dotCN.themedark} .reverse-button {
				fill: #fff;
			}
			${BDFDB.dotCN.themelight} .reverse-button {
				fill: #4f545c;
			}
			.reverse-button:hover {
				cursor: pointer;
				opacity: 1;
			}
			${BDFDB.dotCN.popout}.popout-googletranslate ${BDFDB.dotCN.popoutthemedpopout} {
				padding: 0 10px;
				width: 400px;
			}
			${BDFDB.dotCN.messagegroup} .GTO-translated-message ${BDFDB.dotCNS.messagebody + BDFDB.dotCN.messagemarkup},
			${BDFDB.dotCN.messagegroup} .GTO-translated-message ${BDFDB.dotCNS.messageaccessory + BDFDB.dotCN.embeddescription} {
				font-size: 0 !important;
				line-height: 0 !important;
			}
			${BDFDB.dotCN.messagegroup} .GTO-translated-message ${BDFDB.dotCNS.messagebody + BDFDB.dotCN.messagemarkup} > .GTO-translation {
				font-size: 1rem !important;
				line-height: 1.375 !important;
			}
			${BDFDB.dotCN.messagegroup} .GTO-translated-message ${BDFDB.dotCNS.messageaccessory + BDFDB.dotCN.embeddescription} > .GTO-translation {
				font-size: 0.875rem !important;
				line-height: 1rem !important;
			}
			${BDFDB.dotCN.messagegroup} .GTO-translated-message ${BDFDB.dotCNS.messagebody + BDFDB.dotCN.messagemarkup} > :not(.GTO-translation)${BDFDB.notCN.messageheadercompact + BDFDB.notCN.messageedited},
			${BDFDB.dotCN.messagegroup} .GTO-translated-message ${BDFDB.dotCNS.messageaccessory + BDFDB.dotCN.embeddescription} > :not(.GTO-translation)${BDFDB.notCN.messageedited} {
				display: none !important;
			}`;
	}

	getSettingsPanel () {
		if (!global.BDFDB || typeof BDFDB != "object" || !BDFDB.loaded || !this.started) return;
		var choices = 	BDFDB.getAllData(this, "choices");
		var settings = 	BDFDB.getAllData(this, "settings");
		var settingshtml = `<div class="${this.name}-settings BDFDB-settings"><div class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.size18 + BDFDB.disCNS.height24 + BDFDB.disCNS.weightnormal + BDFDB.disCN.marginbottom8}">${this.name}</div><div class="BDFDB-settings-inner">`;
		for (let key in choices) {
			let choice = this.getLanguageChoice(key);
			settingshtml += `<h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCNS.flexchild + BDFDB.disCNS.marginbottom8 + BDFDB.disCN.margintop8}" style="flex: 1 1 auto;">${this.defaults.choices[key].description}</h3><div class="${BDFDB.disCNS.flex + BDFDB.disCNS.horizontal + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.marginbottom8}" style="flex: 1 1 auto;">${BDFDB.createSelectMenu(this.createSelectChoice(choice), choice, key)}</div>`
		}
		for (let key in settings) {
			settingshtml += `<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.horizontal + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.marginbottom8}" style="flex: 1 1 auto;"><h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.marginreset + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCNS.height24 + BDFDB.disCN.flexchild}" style="flex: 1 1 auto;">${this.defaults.settings[key].description}</h3><div class="${BDFDB.disCNS.flexchild + BDFDB.disCNS.switchenabled + BDFDB.disCNS.switch + BDFDB.disCNS.switchvalue + BDFDB.disCNS.switchsizedefault + BDFDB.disCNS.switchsize + BDFDB.disCN.switchthemedefault}" style="flex: 0 0 auto;"><input type="checkbox" value="settings ${key}" class="${BDFDB.disCNS.switchinnerenabled + BDFDB.disCN.switchinner} settings-switch"${settings[key] ? " checked" : ""}></div></div>`;
		}
		settingshtml += `</div></div>`;

		let settingspanel = BDFDB.htmlToElement(settingshtml);

		BDFDB.initElements(settingspanel, this);

		BDFDB.addEventListener(this, settingspanel, "click", BDFDB.dotCN.selectcontrol, e => {
			let type = BDFDB.getParentEle(BDFDB.dotCN.select, e.currentTarget).getAttribute("type");
			let menulanguages = this.defaults.choices[type].direction == "Output" ? BDFDB.filterObject(this.languages, lang => {return lang.id != "auto";}) : this.languages;
			BDFDB.openDropdownMenu(e, this.saveSelectChoice.bind(this), this.createSelectChoice.bind(this), menulanguages);
		});

		return settingspanel;
	}

	//legacy
	load () {}

	start () {
		if (!global.BDFDB) global.BDFDB = {myPlugins:{}};
		if (global.BDFDB && global.BDFDB.myPlugins && typeof global.BDFDB.myPlugins == "object") global.BDFDB.myPlugins[this.getName()] = this;
		var libraryScript = document.querySelector('head script#BDFDBLibraryScript');
		if (!libraryScript || (performance.now() - libraryScript.getAttribute("date")) > 600000) {
			if (libraryScript) libraryScript.remove();
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("id", "BDFDBLibraryScript");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.js");
			libraryScript.setAttribute("date", performance.now());
			libraryScript.addEventListener("load", () => {this.initialize();});
			document.head.appendChild(libraryScript);
			this.libLoadTimeout = setTimeout(() => {
				libraryScript.remove();
				BDFDB.LibraryRequires.request("https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.js", (error, response, body) => {
					if (body) {
						libraryScript = document.createElement("script");
						libraryScript.setAttribute("id", "BDFDBLibraryScript");
						libraryScript.setAttribute("type", "text/javascript");
						libraryScript.setAttribute("date", performance.now());
						libraryScript.innerText = body;
						document.head.appendChild(libraryScript);
					}
					this.initialize();
				});
			}, 15000);
		}
		else if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) this.initialize();
		this.startTimeout = setTimeout(() => {this.initialize();}, 30000);
	}

	initialize () {
		if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			if (this.started) return;
			BDFDB.loadMessage(this);

			this.setLanguages();

			BDFDB.WebModules.forceAllUpdates(this);
		}
		else {
			console.error(`%c[${this.getName()}]%c`, 'color: #3a71c1; font-weight: 700;', '', 'Fatal Error: Could not load BD functions!');
		}
	}

	stop () {
		if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			document.querySelectorAll(BDFDB.dotCN.messagegroup + " .GTO-translated-message").forEach(message => {
				this.resetMessage(message);
			});

			BDFDB.removeEles(".translate-button", ".popout-googletranslate");

			BDFDB.unloadMessage(this);
		}
	}


	// begin of own functions

	onMessageContextMenu (instance, menu, returnvalue) {
		if (instance.props && instance.props.message && instance.props.channel && instance.props.target && !menu.querySelector(`${this.name}-contextMenuItem`)) {
			let {messagediv, pos} = this.getMessageAndPos(instance.props.target);
			if (!messagediv || pos == -1) return;
			let translated = BDFDB.containsClass(messagediv, "GTO-translated-message");
			let [children, index] = BDFDB.getContextMenuGroupAndIndex(returnvalue, "MessagePinItem");
			const translateUntranslateItem = BDFDB.React.createElement(BDFDB.LibraryComponents.ContextMenuItem, {
				label: translated ? this.labels.context_messageuntranslateoption_text : this.labels.context_messagetranslateoption_text,
				hint: BDFDB.isPluginEnabled("MessageUtilities") ? BDFDB.getPlugin("MessageUtilities").getActiveShortcutString("__Translate_Message") : null,
				className: `BDFDB-contextMenuItem ${this.name}-contextMenuItem ${this.name}-${translated ? "untranslate" : "translate"}-contextMenuItem`,
				action: e => {
					BDFDB.closeContextMenu(menu);
					this.translateMessage(instance.props.message, instance.props.target, instance.props.channel);
				}
			});
			if (index > -1) children.splice(index, 0, translateUntranslateItem);
			else children.push(translateUntranslateItem);
			let text = document.getSelection().toString();
			if (text) {
				let GSRstring = BDFDB.getReactValue(BDFDB.getPlugin("GoogleSearchReplace", true), "labels.context_googlesearchreplace_text");
				let [children2, index2] = BDFDB.getContextMenuGroupAndIndex(returnvalue, GSRstring ? ["SearchWithGoogle", GSRstring] : "SearchWithGoogle");
				var foundtranslation, foundinput, foundoutput;
				const searchTranslationItem = BDFDB.React.createElement(BDFDB.LibraryComponents.ContextMenuItem, {
					label: this.labels.context_googletranslateoption_text,
					className: `BDFDB-contextMenuItem ${this.name}-contextMenuItem ${this.name}-searchtranslation-contextMenuItem`,
					action: e => {
						var item = BDFDB.getParentEle(BDFDB.dotCN.contextmenuitem, e.target);
						if (item) {
							var createTooltip = () => {
								BDFDB.createTooltip(`From ${foundinput.name}:\n${text}\n\nTo ${foundoutput.name}:\n${foundtranslation}`, item, {type:"right", selector:"googletranslate-tooltip"});
							};
							if (foundtranslation && foundinput && foundoutput) {
								if (document.querySelector(".googletranslate-tooltip")) {
									BDFDB.closeContextMenu(menu);
									window.open(this.getGoogleTranslatePageURL(foundinput.id, foundoutput.id, text), "_blank");
								}
								else createTooltip();
							}
							else this.translateText(text, "context", (translation, input, output) => {
								if (translation) {
									foundtranslation = translation, foundinput = input, foundoutput = output;
									createTooltip();
								}
							});
						}
					}
				});
				if (index2 > -1) children2.splice(index2, 0, searchTranslationItem);
				else children2.push(searchTranslationItem);
			}
		}
	}

	onMessageOptionPopout (instance, popout, returnvalue) {
		if (instance.props.message && instance.props.channel && instance.props.target && !popout.querySelector(`${this.name}-popoutMenuItem`)) {
			let {messagediv, pos} = this.getMessageAndPos(instance.props.target);
			if (!messagediv || pos == -1) return;
			let translated = BDFDB.containsClass(messagediv, "GTO-translated-message");
			let [children, index] = BDFDB.getContextMenuGroupAndIndex(returnvalue, [BDFDB.LanguageStrings.PIN, BDFDB.LanguageStrings.UNPIN]);
			const translateUntranslateItem = BDFDB.React.createElement(BDFDB.LibraryComponents.ContextMenuItem, {
				label: this.labels[translated ? "popout_untranslateoption_text" : "popout_translateoption_text"],
				className: `${BDFDB.disCN.optionpopoutitem} BDFDB-popoutMenuItem ${this.name}-popoutMenuItem ${this.name}-${translated ? "untranslate" : "translate"}-popoutMenuItem`,
				action: e => {
					this.translateMessage(instance.props.message, instance.props.target, instance.props.channel);
					instance.props.onClose();
				}
			});
			children.splice(index + 1, 0, translateUntranslateItem);
		}
	}

	setLanguages () {
		this.languages = Object.assign({},
			{"auto":	{name:"Auto",			id:"auto",		integrated:false,	dic:false}},
			BDFDB.languages,
			{"binary":	{name:"Binary",			id:"binary",	integrated:false,	dic:false}},
			{"braille":	{name:"Braille 6-dot",	id:"braille",	integrated:false,	dic:false}},
			{"morse":	{name:"Morse",			id:"morse",		integrated:false,	dic:false}}
		);
		let favorites = BDFDB.loadAllData(this, "favorites")
		for (let id in this.languages) this.languages[id].fav = favorites[id] != undefined ? 0 : 1;
		this.languages = BDFDB.sortObject(this.languages, "fav");
	}

	getLanguageChoice (direction, place) {
		this.setLanguages();
		var type = typeof place === "undefined" ? direction : direction.toLowerCase() + place.charAt(0).toUpperCase() + place.slice(1).toLowerCase();
		var choice = BDFDB.getData(type, this, "choices");
		choice = this.languages[choice] ? choice : Object.keys(this.languages)[0];
		choice = type.indexOf("output") > -1 && choice == "auto" ? "en" : choice;
		return choice;
	}

	processStandardSidebarView (instance, wrapper, returnvalue) {
		if (this.SettingsUpdated) {
			delete this.SettingsUpdated;
			this.setLanguages();
			BDFDB.removeEles(".translate-button");
			BDFDB.WebModules.forceAllUpdates(this, "ChannelTextArea");
		}
	}

	processChannelTextArea (instance, wrapper, returnvalue) {
		if (instance.props && instance.props.type && instance.props.type == "normal" && !instance.props.disabled && !wrapper.querySelector(".translate-button") && BDFDB.getData("addTranslateButton", this, "settings")) {
			let textarea = wrapper.querySelector("textarea");
			if (textarea) {
				var buttoncontainer = wrapper.querySelector(BDFDB.dotCN.textareapickerbuttons);
				if (!buttoncontainer) return;
				var translateButton = BDFDB.htmlToElement(this.translateButtonMarkup);
				translateButton.addEventListener("click", () => {
					this.openTranslatePopout(translateButton);
				});
				translateButton.addEventListener("contextmenu", () => {
					this.translating = !this.translating;
					BDFDB.toggleClass(document.querySelectorAll(BDFDB.dotCNS.textareawrapchat + ".translate-button"), "translating-active", this.translating);
				});
				buttoncontainer.insertBefore(translateButton, buttoncontainer.firstElementChild);
				BDFDB.addClass(translateButton, instance.props.type);
				BDFDB.toggleClass(translateButton, "translating-active", this.translating);
				BDFDB.addEventListener(this, textarea, "input", () => {
					if (this.doTranslate) {
						this.doTranslate = false;
						if (document.activeElement == textarea) {
							var text = textarea.value;
							textarea.focus();
							textarea.selectionStart = 0;
							textarea.selectionEnd = text.length;
							document.execCommand("insertText", false, "");
							this.translateText(text, "message", (translation, input, output) => {
								translation = !translation ? text : (BDFDB.getData("sendOriginalMessage", this, "settings") ? text + "\n\n" + translation : translation);
								textarea.focus();
								document.execCommand("insertText", false, translation + " ");
								BDFDB.triggerSend(textarea);
							});
						}
					}
				});
				BDFDB.addEventListener(this, textarea, "keydown", e => {
					if (textarea.value && this.translating && !e.shiftKey && e.which == 13 && !wrapper.querySelector(BDFDB.dotCN.autocomplete)) {
						this.doTranslate = true;
						textarea.dispatchEvent(new Event("input"));
					}
				});
			}
		}
	}

	processMessage (instance, wrapper, returnvalue) {
		if (instance.props && typeof instance.props.renderButtons == "function" && !wrapper.querySelector(BDFDB.dotCN.optionpopoutbutton) && BDFDB.getReactValue(instance, "props.message.author.id") != 1) {
			let buttonwrap = wrapper.querySelector(BDFDB.dotCN.messagebuttoncontainer);
			if (buttonwrap) {
				let optionPopoutButton = BDFDB.htmlToElement(`<div tabindex="0" class="${BDFDB.disCN.optionpopoutbutton}" aria-label="More Options" role="button"><svg name="OverflowMenu" class="${BDFDB.disCN.optionpopoutbuttonicon}" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0z"></path><path fill="currentColor" d="M12 16c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2z"></path></g></svg></div>`);
				optionPopoutButton.addEventListener("click", () => {BDFDB.createMessageOptionPopout(optionPopoutButton);});
				buttonwrap.appendChild(optionPopoutButton);
			}
		}
	}

	processMessageContent (instance, wrapper, returnvalue) {
		if (instance.props && instance.props.message && instance.props.channel) {
			let messagediv = BDFDB.getParentEle(".GTO-translated-message", wrapper);
			if (messagediv && !wrapper.querySelector(".GTO-translation")) BDFDB.removeClass(messagediv, "GTO-translated-message");
		}
	}

	getMessageAndPos (target) {
		let messagediv = BDFDB.getParentEle(BDFDB.dotCN.messagegroup + "> [aria-disabled]", target) || BDFDB.getParentEle(BDFDB.dotCN.messagegroup + "> * > [aria-disabled]", target);
		let pos = messagediv ? Array.from(messagediv.parentElement.childNodes).filter(n => n.nodeType != Node.TEXT_NODE).indexOf(messagediv) : -1;
		return {messagediv, pos};
	}

	translateMessage (message, target, channel) {
		if (!message || !target) return;
		let {messagediv, pos} = this.getMessageAndPos(target);
		if (!messagediv || pos == -1) return;
		channel = channel ? channel : BDFDB.LibraryModules.ChannelStore.getChannel(message.channel_id);
		if (!messagediv.querySelector(BDFDB.dotCN.messageedited + ".GTO-translated")) {
			var markup = messagediv.querySelector(BDFDB.dotCN.messagemarkup);
			var accessory = messagediv.querySelector(BDFDB.dotCN.messageaccessory);
			var embeddescriptions = messagediv.querySelectorAll(BDFDB.dotCN.embeddescription)
			var fakemarkup = markup.cloneNode(true);
			BDFDB.removeEles(fakemarkup.querySelectorAll(BDFDB.dotCNC.messageheadercompact + BDFDB.dotCN.messageedited));
			let string = fakemarkup.innerHTML;
			if (embeddescriptions.length) for (let embeddescription of embeddescriptions) {
				string += "\n__________________ __________________ __________________\n";
				string += embeddescription.innerHTML;;
			}
			this.translateText(string, "context", (translation, input, output) => {
				if (translation) {
					BDFDB.addClass(messagediv, "GTO-translated-message");
					let translations = translation.split("\n__________________ __________________ __________________\n");
					let compactheader = markup.querySelector(BDFDB.dotCN.messageheadercompact);
					markup.insertBefore(BDFDB.htmlToElement(`<label class="GTO-translation">${translations.shift().replace(/\n/g, "BDFDB_GTO_PLACEHOLDER").replace(/\s/g, " ").replace(/BDFDB_GTO_PLACEHOLDER/g, "\n").replace(/> *(\n*) *</g, ">$1<").replace(/> +/g, "> ").replace(/ +</g, " <").replace(/> *([^ ]*) *<\//g, ">$1</").trim()}<time class="${BDFDB.disCN.messageedited} GTO-translated">(${this.labels.translated_watermark_text})</time></label>`), compactheader ? compactheader.nextSibling : markup.firstChild);
					if (embeddescriptions.length) for (let embeddescription of embeddescriptions) {
						embeddescription.insertBefore(BDFDB.htmlToElement(`<label class="GTO-translation">${translations.shift().trim()}<time class="${BDFDB.disCN.messageedited} GTO-translated">(${this.labels.translated_watermark_text})</time></label>`), embeddescription.firstChild);
					}
					BDFDB.addChildEventListener(messagediv, "mouseenter", BDFDB.dotCN.messageedited + ".GTO-translated", e => {
						BDFDB.createTooltip(`<div>From: ${input.name}</div><div>To: ${output.name}</div>`, e.currentTarget, {html:true, type:"top", selector:"translation-tooltip"});
					});
				}
			});
		}
		else this.resetMessage(messagediv);
	}

	resetMessage (messagediv) {
		BDFDB.removeEles(messagediv.querySelectorAll(".GTO-translation"));
		BDFDB.removeClass(messagediv, "GTO-translated-message");
	}

	translateText (text, type, callback) {
		var toast = null;
		var finishTranslation = (translation, exceptions, input, output, toast) => {
			if (translation) translation = this.addExceptions(translation, exceptions);
			if (toast) {
				clearInterval(toast.interval);
				toast.close();
			}
			callback(translation, input, output);
		};
		var translationError = (exceptions, input, output, toast, test) => {
			BDFDB.showToast("Could not translate message, you most likely got rate limited by Google for today due to too frequent usage of their Translate-API.", {type:"error",timeout:15000});
			finishTranslation(null, exceptions, input, output, toast);
		};
		var [newtext, exceptions, translate] = this.removeExceptions(text.trim(), type);
		var input = Object.assign({}, this.languages[this.getLanguageChoice("input", type)]);
		var output = Object.assign({}, this.languages[this.getLanguageChoice("output", type)]);
		var translation = "";
		if (translate) {
			toast = BDFDB.showToast("Translating. Please wait", {timeout:0});
			toast.interval = setInterval(() => {
				toast.textContent = toast.textContent.indexOf(".....") > -1 ? "Translating. Please wait" : toast.textContent + ".";
			},500);
			var specialcase = this.checkForSpecialCase(newtext, input);
			if (specialcase) {
				input.name = specialcase.name;
				switch (specialcase.id) {
					case "binary": newtext = this.binary2string(newtext); break;
					case "braille": newtext = this.braille2string(newtext); break;
					case "morse": newtext = this.morse2string(newtext); break;
				}
			}
			if (output.id == "binary" || output.id == "braille" || output.id == "morse") {
				switch (output.id) {
					case "binary": newtext = this.string2binary(newtext); break;
					case "braille": newtext = this.string2braille(newtext); break;
					case "morse": newtext = this.string2morse(newtext); break;
				}
				finishTranslation(newtext, exceptions, input, output, toast);
			}
			else {
				BDFDB.LibraryRequires.request(this.getGoogleTranslateApiURL(input.id, output.id, newtext), (error, response, result) => {
					if (!error && result) {
						try {
							result = JSON.parse(result);
							if (result) {
								result[0].forEach((array) => {translation += array[0];});
								if (!specialcase && this.languages[result[2]]) input.name = this.languages[result[2]].name;
							}
							else translation = text;
							finishTranslation(translation, exceptions, input, output, toast);
						}
						catch (err) {
							translationError(exceptions, input, output, toast, "a");
						}
					}
					else translationError(exceptions, input, output, toast, "b");
				});
			}
		}
		else {
			translation = text;
			finishTranslation(translation, exceptions, input, output, toast);
		}
	}

	checkForSpecialCase (text, input) {
		if (input.id == "binary" || input.id == "braille" || input.id == "morse") return input;
		else if (input.id == "auto") {
			if (/^[0-1]*$/.test(text.replace(/\s/g, ""))) {
				return {id: "binary", name: "Binary"};
			}
			else if (/^[⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿]*$/.test(text.replace(/\s/g, ""))) {
				return {id: "braille", name: "Braille 6-dot"};
			}
			else if (/^[/|·−._-]*$/.test(text.replace(/\s/g, ""))) {
				return {id: "morse", name: "Morse"};
			}
		}
		return null;
	}

	string2binary (string) {
		var binary = "";
		for (let character of string) binary += parseInt(character.charCodeAt(0).toString(2)).toPrecision(8).split(".").reverse().join("").toString() + " ";
		return binary;
	}

	string2braille (string) {
		var braille = "";
		for (let character of string) braille += this.brailleConverter[character.toLowerCase()] ? this.brailleConverter[character.toLowerCase()] : character;
		return braille;
	}

	string2morse (string) {
		string = string.replace(/ /g, "%%%%%%%%%%");
		var morse = "";
		for (let character of string) morse += (this.morseConverter[character.toLowerCase()] ? this.morseConverter[character.toLowerCase()] : character) + " ";
		morse = morse.split("\n");
		for (let i in morse) morse[i] = morse[i].trim();
		return morse.join("\n").replace(/% % % % % % % % % % /g, "/ ");
	}

	binary2string (binary) {
		var string = "";
		binary = binary.replace(/\n/g, "00001010").replace(/\r/g, "00001101").replace(/\t/g, "00001001").replace(/\s/g, "");
		if (/^[0-1]*$/.test(binary)) {
			var eightdigits = "";
			var counter = 0;
			for (var digit of binary) {
				eightdigits += digit;
				counter++;
				if (counter > 7) {
					string += String.fromCharCode(parseInt(eightdigits,2).toString(10));
					eightdigits = "";
					counter = 0;
				}
			}
		}
		else BDFDB.showToast("Invalid binary format. Only use 0s and 1s.", {type:"error"});
		return string;
	}

	braille2string (braille) {
		var string = "";
		for (let character of braille) string += this.brailleConverter[character.toLowerCase()] ? this.brailleConverter[character.toLowerCase()] : character;
		return string;
	}

	morse2string (morse) {
		var string = "";
		for (let word of morse.replace(/[_-]/g, "−").replace(/\./g, "·").replace(/\r|\t/g, "").split(/\/|\||\n/g)) {
			for (let characterstr of word.trim().split(" ")) string += this.morseConverter[characterstr] ? this.morseConverter[characterstr] : characterstr;
			string += " ";
		}
		return string.trim();
	}

	addExceptions (string, exceptions) {
		for (let i in exceptions) string = string.replace("a" + i + "_______", exceptions[i].indexOf("!") == 0 ? exceptions[i].slice(1) : exceptions[i]);
		return string;
	}

	removeExceptions (string, type) {
		var exceptions = {}, newString = [], count = 0;
		if (type == "context") {
			let text = [], i = 0;
			string.split("").forEach(chara => { 
				if (chara == "<" && text[i]) i++;
				text[i] = text[i] ? text[i] + chara : chara;
				if (chara == ">") i++;
			});
			for (let j in text) {
				if (text[j].indexOf("<") == 0) {
					newString.push("a" + count + "_______");
					exceptions[count] = text[j];
					count++;
				}
				else newString.push(text[j]);
			}
		}
		else {
			string.split(" ").forEach(word => {
				if (word.indexOf("<@!") == 0 || word.indexOf(":") == 0 || word.indexOf("@") == 0 || word.indexOf("#") == 0 || (word.indexOf("!") == 0 && word.length > 1)) {
					newString.push("a" + count + "_______");
					exceptions[count] = word;
					count++;
				}
				else newString.push(word);
			});
		}
		return [newString.join(" "), exceptions, newString.length-count != 0];
	}

	openTranslatePopout (button) {
		let container = document.querySelector(BDFDB.dotCN.popouts);
		if (!container || BDFDB.containsClass(button, BDFDB.disCN.textareabuttonactive)) return;
		BDFDB.addClass(button, BDFDB.disCN.textareabuttonactive);
		let translatepopout = BDFDB.htmlToElement(this.translatePopoutMarkup);
		container.appendChild(translatepopout);
		let buttonrects = BDFDB.getRects(button);
		translatepopout.style.setProperty("left", buttonrects.left + buttonrects.width + "px");
		translatepopout.style.setProperty("top", buttonrects.top - buttonrects.height/2 + "px")

		BDFDB.addChildEventListener(translatepopout, "click", BDFDB.dotCN.selectcontrol, e => {
			let type = BDFDB.getParentEle(BDFDB.dotCN.select, e.currentTarget).getAttribute("type");
			let menulanguages = this.defaults.choices[type].direction == "Output" ? BDFDB.filterObject(this.languages, lang => {return lang.id != "auto";}) : this.languages;
			let menu = BDFDB.openDropdownMenu(e, this.saveSelectChoice.bind(this), this.createSelectChoice.bind(this), menulanguages, true);
			BDFDB.addChildEventListener(menu, "click", BDFDB.dotCN.giffavoritebutton, e => {
				let choice = e.currentTarget.parentElement.getAttribute("value");
				if (choice) {
					let favorize = !BDFDB.loadData(choice, this, "favorites")
					if (favorize) BDFDB.saveData(choice, true, this, "favorites");
					else BDFDB.removeData(choice, this, "favorites");
					this.setLanguages();
				}
			});
		});
		BDFDB.addChildEventListener(translatepopout, "click", ".reverse-button", e => {
			let place = e.currentTarget.getAttribute("type").replace("output","");
			let input = this.getLanguageChoice("output", place);
			let output = this.getLanguageChoice("input", place);
			output = output == "auto" ? "en" : output;
			let inputselect = translatepopout.querySelector(BDFDB.dotCN.select + "[type='input" + place + "']");
			let outputselect = translatepopout.querySelector(BDFDB.dotCN.select + "[type='output" + place + "']");
			inputselect.setAttribute("value", input);
			inputselect.querySelector(BDFDB.dotCN.title).innerText = this.languages[input].name;
			outputselect.setAttribute("value", output);
			outputselect.querySelector(BDFDB.dotCN.title).innerText = this.languages[output].name;
			BDFDB.saveData("input" + place, input, this, "choices");
			BDFDB.saveData("output" + place, output, this, "choices");
		});

		translatepopout.querySelectorAll(BDFDB.dotCN.select).forEach(selectWrap => {
			let language = this.getLanguageChoice(selectWrap.getAttribute("type"));
			selectWrap.setAttribute("value", language);
			selectWrap.querySelector(BDFDB.dotCN.title).innerText = this.languages[language].name;
		});

		var translatecheckbox = translatepopout.querySelector("#translating-checkbox");
		translatecheckbox.checked = this.translating;
		translatecheckbox.addEventListener("click", () => {
			BDFDB.toggleClass(button, "translating-active", translatecheckbox.checked);
			this.translating = translatecheckbox.checked;
		});

		var removePopout = e => {
			if (!translatepopout.contains(e.target)) {
				document.removeEventListener("mousedown", removePopout);
				translatepopout.remove();
				setTimeout(() => {BDFDB.removeClass(button, BDFDB.disCN.textareabuttonactive);},300);
			}
		};
		document.addEventListener("mousedown", removePopout);

		BDFDB.initElements(translatepopout, this);
	}

	saveSelectChoice (selectWrap, type, choice) {
		if (type && choice) {
			selectWrap.querySelector(BDFDB.dotCN.title).innerText = this.languages[choice].name;
			BDFDB.saveData(type, choice, this, "choices");
		}
	}

	createSelectChoice (key) {
		return `<div class="${BDFDB.disCNS.title + BDFDB.disCNS.medium + BDFDB.disCNS.primary + BDFDB.disCNS.weightnormal + BDFDB.disCN.cursorpointer}" style="flex: 1 1 auto;">${this.languages[key].name}</div><div tabindex="0" class="${BDFDB.disCNS.giffavoritebutton + BDFDB.disCN.giffavoritecolor + (this.languages[key].fav == 0 ? ' ' + BDFDB.disCN.giffavoriteselected : '')}" role="button" style="width: 24px !important; height: 24px !important; position: relative !important; opacity: 1 !important; transform: none !important;"><svg class="${BDFDB.disCNS.giffavoriteicon}" name="Favorite" viewBox="2 2 20 20" width="24" height="24"></svg></div>`;
	}

	getGoogleTranslateApiURL (input, output, text) {
		input = BDFDB.languages[input] ? input : "auto";
		return "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + input + "&tl=" + output + "&dt=t&ie=UTF-8&oe=UTF-8&q=" + encodeURIComponent(text);
	}

	getGoogleTranslatePageURL (input, output, text) {
		input = BDFDB.languages[input] ? input : "auto";
		return "https://translate.google.com/#" + input + "/" + output + "/" + encodeURIComponent(text);
	}

	setLabelsByLanguage () {
		switch (BDFDB.getDiscordLanguage().id) {
			case "hr":		//croatian
				return {
					context_messagetranslateoption_text:	"Prijevod poruke",
					context_messageuntranslateoption_text:	"Prijenos poruke",
					context_googletranslateoption_text:		"Traži prijevod",
					popout_translateoption_text:			"Prevesti",
					popout_untranslateoption_text:			"Prevesti natrag",
					translated_watermark_text:				"preveo"
				};
			case "da":		//danish
				return {
					context_messagetranslateoption_text:	"Oversæt Besked",
					context_messageuntranslateoption_text:	"Oversæt Besked tilbage",
					context_googletranslateoption_text:		"Søg oversættelse",
					popout_translateoption_text:			"Oversætte",
					popout_untranslateoption_text:			"Oversæt tilbage",
					translated_watermark_text:				"oversat"
				};
			case "de":		//german
				return {
					context_messagetranslateoption_text:	"Nachricht übersetzen",
					context_messageuntranslateoption_text:	"Nachricht unübersetzen",
					context_googletranslateoption_text:		"Suche Übersetzung",
					popout_translateoption_text:			"Übersetzen",
					popout_untranslateoption_text:			"Unübersetzen",
					translated_watermark_text:				"übersetzt"
				};
			case "es":		//spanish
				return {
					context_messagetranslateoption_text:	"Traducir mensaje",
					context_messageuntranslateoption_text:	"Traducir mensaje de vuelta",
					context_googletranslateoption_text:		"Buscar traducción",
					popout_translateoption_text:			"Traducir",
					popout_untranslateoption_text:			"Traducir de vuelta",
					translated_watermark_text:				"traducido"
				};
			case "fr":		//french
				return {
					context_messagetranslateoption_text:	"Traduire le message",
					context_messageuntranslateoption_text:	"Traduire le message en retour",
					context_googletranslateoption_text:		"Rechercher une traduction",
					popout_translateoption_text:			"Traduire",
					popout_untranslateoption_text:			"Traduire en arrière",
					translated_watermark_text:				"traduit"
				};
			case "it":		//italian
				return {
					context_messagetranslateoption_text:	"Tradurre il messaggio",
					context_messageuntranslateoption_text:	"Tradurre il messaggio indietro",
					context_googletranslateoption_text:		"Cerca la traduzione",
					popout_translateoption_text:			"Traduci",
					popout_untranslateoption_text:			"Traduci indietro",
					translated_watermark_text:				"tradotto"
				};
			case "nl":		//dutch
				return {
					context_messagetranslateoption_text:	"Vertaal bericht",
					context_messageuntranslateoption_text:	"Vertaal bericht terug",
					context_googletranslateoption_text:		"Zoek vertaling",
					popout_translateoption_text:			"Vertaal",
					popout_untranslateoption_text:			"Vertaal terug",
					translated_watermark_text:				"vertaalde"
				};
			case "no":		//norwegian
				return {
					context_messagetranslateoption_text:	"Oversett melding",
					context_messageuntranslateoption_text:	"Oversett melding tilbake",
					context_googletranslateoption_text:		"Søk oversettelse",
					popout_translateoption_text:			"Oversett",
					popout_untranslateoption_text:			"Oversett tilbake",
					translated_watermark_text:				"oversatt"
				};
			case "pl":		//polish
				return {
					context_messagetranslateoption_text:	"Przetłumacz wiadomość",
					context_messageuntranslateoption_text:	"Przetłumacz wiadomość z powrotem",
					context_googletranslateoption_text:		"Wyszukaj tłumaczenie",
					popout_translateoption_text:			"Przetłumacz",
					popout_untranslateoption_text:			"Przetłumacz ponownie",
					translated_watermark_text:				"przetłumaczony"
				};
			case "pt-BR":	//portuguese (brazil)
				return {
					context_messagetranslateoption_text:	"Traduzir mensagem",
					context_messageuntranslateoption_text:	"Traduzir mensagem de volta",
					context_googletranslateoption_text:		"Pesquisar tradução",
					popout_translateoption_text:			"Traduzir",
					popout_untranslateoption_text:			"Traduzir de volta",
					translated_watermark_text:				"traduzido"
				};
			case "fi":		//finnish
				return {
					context_messagetranslateoption_text:	"Käännä viesti",
					context_messageuntranslateoption_text:	"Käännä viesti takaisin",
					context_googletranslateoption_text:		"Etsi käännös",
					popout_translateoption_text:			"Kääntää",
					popout_untranslateoption_text:			"Käännä takaisin",
					translated_watermark_text:				"käännetty"
				};
			case "sv":		//swedish
				return {
					context_messagetranslateoption_text:	"Översätt meddelande",
					context_messageuntranslateoption_text:	"Översätt meddelandet tillbaka",
					context_googletranslateoption_text:		"Sök översättning",
					popout_translateoption_text:			"Översätt",
					popout_untranslateoption_text:			"Översätt tillbaka",
					translated_watermark_text:				"översatt"
				};
			case "tr":		//turkish
				return {
					context_messagetranslateoption_text:	"Mesajı çevir",
					context_messageuntranslateoption_text:	"İletiyi geri çevir",
					context_googletranslateoption_text:		"Arama tercümesi",
					popout_translateoption_text:			"Çevirmek",
					popout_untranslateoption_text:			"Geri çevir",
					translated_watermark_text:				"tercüme"
				};
			case "cs":		//czech
				return {
					context_messagetranslateoption_text:	"Přeposlat zprávu",
					context_messageuntranslateoption_text:	"Přeposlat zprávu zpátky",
					context_googletranslateoption_text:		"Hledat překlad",
					popout_translateoption_text:			"Přeposlat",
					popout_untranslateoption_text:			"Přeposlat zpět",
					translated_watermark_text:				"přeloženo"
				};
			case "bg":		//bulgarian
				return {
					context_messagetranslateoption_text:	"Преведете на съобщението",
					context_messageuntranslateoption_text:	"Преведете съобщението обратно",
					context_googletranslateoption_text:		"Търсене на превод",
					popout_translateoption_text:			"Превод",
					popout_untranslateoption_text:			"Превод обратно",
					translated_watermark_text:				"преведена"
				};
			case "ru":		//russian
				return {
					context_messagetranslateoption_text:	"Перевести сообщение",
					context_messageuntranslateoption_text:	"Перевести сообщение обратно",
					context_googletranslateoption_text:		"Поиск перевода",
					popout_translateoption_text:			"Перевести",
					popout_untranslateoption_text:			"Перевести обратно",
					translated_watermark_text:				"переведенный"
				};
			case "uk":		//ukrainian
				return {
					context_messagetranslateoption_text:	"Перекласти повідомлення",
					context_messageuntranslateoption_text:	"Перекласти повідомлення назад",
					context_googletranslateoption_text:		"Пошук перекладу",
					popout_translateoption_text:			"Перекласти",
					popout_untranslateoption_text:			"Перекласти назад",
					translated_watermark_text:				"перекладений"
				};
			case "ja":		//japanese
				return {
					context_messagetranslateoption_text:	"メッセージを翻訳する",
					context_messageuntranslateoption_text:	"メッセージを翻訳する",
					context_googletranslateoption_text:		"翻訳の検索",
					popout_translateoption_text:			"翻訳",
					popout_untranslateoption_text:			"翻訳する",
					translated_watermark_text:				"翻訳された"
				};
			case "zh-TW":	//chinese (traditional)
				return {
					context_messagetranslateoption_text:	"翻譯消息",
					context_messageuntranslateoption_text:	"翻譯消息",
					context_googletranslateoption_text:		"搜索翻譯",
					popout_translateoption_text:			"翻譯",
					popout_untranslateoption_text:			"翻譯回來",
					translated_watermark_text:				"翻譯"
				};
			case "ko":		//korean
				return {
					context_messagetranslateoption_text:	"메시지 번역",
					context_messageuntranslateoption_text:	"메시지 번역 뒤로",
					context_googletranslateoption_text:		"검색 번역",
					popout_translateoption_text:			"다시",
					popout_untranslateoption_text:			"다시 번역",
					translated_watermark_text:				"번역 된"
				};
			default:		//default: english
				return {
					context_messagetranslateoption_text:	"Translate Message",
					context_messageuntranslateoption_text:	"Untranslate Message",
					context_googletranslateoption_text:		"Search translation",
					popout_translateoption_text:			"Translate",
					popout_untranslateoption_text:			"Untranslate",
					translated_watermark_text:				"translated"
				};
		}
	}
}