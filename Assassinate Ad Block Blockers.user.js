// ==UserScript==
// @name         Assassinate Ad Block Blockers
// @namespace    http://tampermonkey.net/
// @version      1.45
// @description  You know those annoying content blockers that demand you remove your AdBlock so you can read the content? This script removes them by force. Please note, this is not UNIVERSAL like AdBlock Plus. It operates on a per-site basis.
// @author       Kxmode
// @run-at       document-idle
// @match        *://www.vg247.com/*
// @match        *://www.eurogamer.net/*
// @match        *://www.makeuseof.com/*
// @match        *://www.gamesradar.com/*
// @match        *://www.usatoday.com/*
// @match        *://www.cnn.com/*
// @match        *://www.businessinsider.com/*
// @match        *://markets.businessinsider.com/*
// @match        *://www.thedailybeast.com/*
// @match        *://www.forbes.com/*
// @match        *://*.nytimes.com/*
// @match        *://*.dailymail.co.uk/*
// @match        *://*.washingtonpost.com/*
// @match        *://*.insider.com/*
// @match        *://*.latimes.com/*
// @match        *://*.mercurynews.com/*
// @match        *://*.nationalgeographic.com/*
// @match        *://*.sfchronicle.com/*
// @match        *://*seekingalpha.com/*
// @match        *://www.bloomberg.com/*
// @match        *://www.vulture.com/*
// @match        *://*.nymag.com/*
// @match        *://www.thecut.com/*
// @match        *://www.curbed.com/*
// ==/UserScript==

/* jshint esversion: 6 */
/* eslint-disable */

// Loads jQuery and triggers a callback function when jQuery has finished loading
function addJQuery(callback) {
    let script = document.createElement('script');
    script.setAttribute('src', '//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js');
    script.addEventListener('load', function() { callback(); }, false);
    document.body.appendChild(script);
}

// The main script
function main() {

	const $ = (unsafeWindow || window).$;
	const URL_HOSTNAME = window.location.hostname;

	// For domains that uses a specific service blocking AdBlockers
	const STANDARD_BLOCKER_DOMAINS = [ 'www.vg247.com',
										'www.gamesradar.com',
										'www.cnn.com'].map(String);

	// For domains that follow a nonstandard or custom way of blocking AdBlockers
	const ABNORMAL_BLOCKER_DONAINS = [ 'www.makeuseof.com',
										'www.businessinsider.com',
										'www.thedailybeast.com',
										'www.nytimes.com',
										'cooking.nytimes.com',
										'www.forbes.com',
										'www.dailymail.co.uk',
										'www.washingtonpost.com',
										'www.insider.com',
										'www.latimes.com',
										'www.mercurynews.com',
										'www.nationalgeographic.com',
										'www.sfchronicle.com',
										'seekingalpha.com',
										'www.eurogamer.net',
										'www.usatoday.com',
										'markets.businessinsider.com',
										'www.bloomberg.com',
										'www.vulture.com',
										'nymag.com',
										'www.thecut.com',
										'www.curbed.com'].map(String);

	// For domains that typically launch third-party modals for random stuff like sign-ups
	const AUXILIARY_BLOCKER_DOMAINS = [ 'www.gamesradar.com'].map(String);

	const DOMAIN = {
		'BusinessInsider': ABNORMAL_BLOCKER_DONAINS[1],
		'BusinessInsiderMarkets': ABNORMAL_BLOCKER_DONAINS[16],
		'Bloomberg': ABNORMAL_BLOCKER_DONAINS[17],
		'CNN': STANDARD_BLOCKER_DOMAINS[2],
		'Curbed': ABNORMAL_BLOCKER_DONAINS[21],
		'DailyMail': ABNORMAL_BLOCKER_DONAINS[6],
		'EuroGamer': ABNORMAL_BLOCKER_DONAINS[14],
		'Forbes': ABNORMAL_BLOCKER_DONAINS[5],
		'GamesRadar': STANDARD_BLOCKER_DOMAINS[1],
		'GamesRadarAuxiliary': AUXILIARY_BLOCKER_DOMAINS[0],
		'Insider': ABNORMAL_BLOCKER_DONAINS[8],
		'LATimes': ABNORMAL_BLOCKER_DONAINS[9],
		'MakeUseOf': ABNORMAL_BLOCKER_DONAINS[0],
		'MercuryNews': ABNORMAL_BLOCKER_DONAINS[10],
		'NewYorkTimes': ABNORMAL_BLOCKER_DONAINS[3],
		'NewYorkTimesCooking': ABNORMAL_BLOCKER_DONAINS[4],
		'NYMag': ABNORMAL_BLOCKER_DONAINS[19],
		'SeekingAlpha': ABNORMAL_BLOCKER_DONAINS[13],
		'SFChronicle': ABNORMAL_BLOCKER_DONAINS[12],
		'TheCut': ABNORMAL_BLOCKER_DONAINS[20],
		'TheDailyBeast': ABNORMAL_BLOCKER_DONAINS[2],
		'USAToday': ABNORMAL_BLOCKER_DONAINS[15],
		'VG247': STANDARD_BLOCKER_DOMAINS[0],
		'Vulture': ABNORMAL_BLOCKER_DONAINS[18],
		'WashingtonPost': ABNORMAL_BLOCKER_DONAINS[7],
	}

	function startingRemovalMessage(message) {
		$('body').prepend(`<div id="Injected-By-Assassinate-Ad-Block-Blockers" style="background-color: #D8070E; font-weight: bold; color: white; text-align: center; margin: auto; padding: 10px; position: relative; z-index: 9999999999 !important; top: 220px;"><style>#Injected-By-Assassinate-Ad-Block-Blockers img { width: unset; }</style><img src="https://i.imgur.com/velCxDX.gif" style="display: inline-block; vertical-align: middle;" /> <span>${ message }</span></div>`);
	}

	function successRemovalMessage() {
		$('#Injected-By-Assassinate-Ad-Block-Blockers').attr('style','background-color: green; font-weight: bold; color: white; text-align: center; margin: auto; padding: 10px; position: relative; z-index: 9999999999 !important; transition: .5s; top: 220px;');
		$('#Injected-By-Assassinate-Ad-Block-Blockers').find('img').attr('src','https://i.imgur.com/i5e5xp0.gif');
		$('#Injected-By-Assassinate-Ad-Block-Blockers').find('span').text('Success. Enjoy!');
	}

	function clearCookie(name, domain, path){
		domain = domain || document.domain;
		path = path || "/";
		document.cookie = name + "=; expires=" + + new Date() + "; domain=" + domain + "; path=" + path;
	}

	/* A utility function, for Greasemonkey scripts, that detects and handles DOM mutation.
	* Author: https://gist.github.com/BrockA/2625891
	* License: Creative Commons, Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
	* Dependency: jQuery
	* Usage example:
	*		waitForKeyElements (
	*		    "div.comments", commentCallbackFunction
	*       );
	* Page-specific function to do what we want when the node is found.
    * Usage example:
	*       function commentCallbackFunction (jNode) {
	*           jNode.text ("This comment changed by waitForKeyElements().");
	*       }
	*/
	function waitForTargetElements (
		selectorTxt,    // Required: The jQuery selector string that specifies the desired element(s).
		actionFunction, // Required: The code to run when elements are found. It is passed a jNode to the matched element.
		bWaitOnce,      // Optional: If false, will continue to scan for new elements even after the first match is found.
		iframeSelector  // Optional: If set, identifies the iframe to search.
	) {
		let targetNodes, btargetsFound;

		if (typeof iframeSelector == "undefined")
			targetNodes = $(selectorTxt);
		else
			targetNodes = $(iframeSelector).contents().find(selectorTxt);

		if (targetNodes  &&  targetNodes.length > 0) {
			btargetsFound = true;
			// Target node(s) found. Iterate through each and act if they are new.
			targetNodes.each ( function () {
				let jThis = $(this);
				let alreadyFound = jThis.data ('alreadyFound')  ||  false;

				if (!alreadyFound) {
					// Call the payload function
					let cancelFound = actionFunction (jThis);
					if (cancelFound)
						btargetsFound = false;
					else
						jThis.data ('alreadyFound', true);
				}
			} );
		}
		else {
			btargetsFound = false;
		}

		// Get the timer-control variable for this selector
		let controlObj = waitForTargetElements.controlObj || {};
		let controlKey = selectorTxt.replace (/[^\w]/g, "_");
		let timeControl = controlObj [controlKey];

		// Now set or clear the timer as appropriate
		if (btargetsFound && bWaitOnce && timeControl) {
			// The only condition where we need to clear the timer
			clearInterval (timeControl);
			delete controlObj [controlKey];
		}
		else {
			// Set a timer, if needed
			if ( ! timeControl) {
				timeControl = setInterval ( function () {
						waitForTargetElements ( selectorTxt,
											 actionFunction,
											 bWaitOnce,
											 iframeSelector
											);
					},
					300
				);
				controlObj [controlKey] = timeControl;
			}
		}
		waitForTargetElements.controlObj = controlObj;
	}

	// Sledgehammer 2.0 prototype
	function removeDOMElement(node)                 { node.remove(); }
	function removeContentHeightLock(node)          { node.attr('style','max-height: unset; overflow: unset;'); }

	// General
	function standardRemoval() {
		let isHTMLBlocked = $('html').attr('style');
		let isBodyBlocked = $('body').attr('style');
		let isHTMLClassBlocked = $('html').hasClass('sp-message-open');

		if (isHTMLBlocked !== undefined || isBodyBlocked !== undefined || isHTMLClassBlocked)
		{
			clearInterval(currentStatus1);
			// We're on a page that is blocked

			$('html').removeAttr('style');
			$('body').removeAttr('style');
			$('html').removeClass('sp-message-open');

			switch(URL_HOSTNAME)
			{
				case DOMAIN.VG247:
				case DOMAIN.CNN:
					$('[class*="sp_veil"]').remove();
					$('[id*="sp_message_id"]').remove();
					break;
			}
		}

		console.clear();
	}

	// Site specific
	function Bloomberg() {
		$('#graphics-paywall-overlay').remove();
		$('body').removeAttr('data-paywall-overlay-status');
	}
	function BusinessInsider() {
		$('.tp-modal').remove();
		$('.tp-backdrop').remove();
		$('body').removeClass('tp-modal-open');
	}
	function Curbed() {
		$('html').attr('style', 'overflow-y: unset;');
		$('body').attr('style', 'position: unset; width: 1100px; margin: 0 auto;');
		$('.article .article-header, .article .article-header.inline').attr('style', 'margin: unset;');
		$('.article .lede-image-wrapper.inline.horizontal').attr('style', 'margin: unset;');
		$('#paywall-reader-interface').remove();
	}
	function DailyMail() {
		$('#mol-ads-cmp-iframe').next().remove();
		$('html').removeAttr('class');
		$('body').removeAttr('class');
	}
	function EuroGamer() {
		$('html').removeAttr('style');
		$('html').removeClass('sp-message-open');
		$('body').removeAttr('style');
		$('[class*="sp_veil"]').remove();
		$('[id*="sp_message_id"]').remove();
	}
	function Forbes() {
		$('.tp-modal').remove();
		$('.tp-backdrop.tp-active').remove();
		$('body').removeAttr('class');
		$('.page-loaded').remove();
		$('.article-fixed[_nghost-c11]').attr('style', 'position: unset;');
		// abnormal situation. these appear on certain pages.
		$('#lightboxjs-lightboxlib').remove();
		$('#aax_prefetch_frame').remove();
		$('#cok_aax').remove();
		$('body > iframe:nth-of-type(1)').remove(); // these run in sequence. we want to remove the first 7-9 iframes since iframes typically contain ABB-related injection code or advertisements.
		$('body > iframe:nth-of-type(1)').remove();
		$('body > iframe:nth-of-type(1)').remove();
		$('body > iframe:nth-of-type(1)').remove();
		$('body > iframe:nth-of-type(1)').remove();
		$('body > iframe:nth-of-type(1)').remove();
		$('.fbs-auth__container').remove();
		$('.fbs-ad--ntv-contentd-wrapper').remove();
		$('.body--no-scroll').attr('style', 'overflow: unset;');
		$.each($('script'), function() { // scans all scripts for a very specific paywall script
			let selector = $(this).attr('src');
			let target = String(selector).match(/(paywall)+.(unlock-protocol)+./g); // the script is found
			if (target !== null)
			{
				$(this).remove(); // and removed so that it can't re-inject itself
			}
		});
		$('#article-container-0').attr('style','position: unset;');
	}
	function GamesRadar(interval) {
		if ($('.raleigh-optin-visible').is(':visible'))
			$('[class*="raleigh-optin-"]').remove();

		if (typeof interval !== 'undefined')
			clearInterval(interval);
		else
			clearAllIntervals();
	}
	function Insider() {
		$('.tp-modal').remove();
		$('.tp-backdrop.tp-active').remove();
		$('body').removeAttr('class');
	}
	function LATimes() {
		$('html').attr('style','overflow: unset;');
		$('body').removeAttr('style');
		$('.Page-body').removeAttr('style');
		$('.fc-ab-root').remove();
		$('.meter-modal').parent().remove();
	}
	function MakeUseOf() {
		$('[class*="unblockplease-overlay"]').remove();
		$('.unblockplease').removeAttr('style');
	}
	function MercuryNews() {
		$('.modal-scrollable').remove();
		$('.connext-modal-backdrop').remove();
		$('body').removeClass('modal-open');
	}
	function NationalGeographic() {
		$('.fancybox-overlay').remove();
		$('#paywall-meter').remove();
		$('html').removeClass('fancybox-lock');
		$('body').removeAttr('style');
		$('.Modal.PaywallModal').remove();
		$('.Modal.EmailStickyFooter__Modal').parent().parent().remove();

		$('#Injected-By-Assassinate-Ad-Block-Blockers').remove();
		console.clear();
		console.log('blocker code removed');
	}
	function NewYorkTimes() {
		// nytimes
		$('#standalone-footer').remove();
		$('#gateway-content').remove();
		$('body').attr('style', 'overflow: unset;');
		$('#site-content').attr('style','position: unset;');
		$('[id*="lire-ui-"').remove();
		$('[class*="css-1bd"]').remove();

		// nytimes' cooking
		$('.nytc---modal-window---windowContainer').parents('#appContainer').remove(); // a modal with no close button. wtf nyt?!
		$('#container').attr('style','overflow: unset;');
		$('.nytc---modal-window---noScroll').attr('style','overflow: unset;');
		$('#site-content').attr('style','position: unset;');

		// nytimes' magazine and site-wide
		$('[class*="css-mcm"]').attr('style','position: unset;');
	}
	function NYMag() {
		$('html').removeAttr('style');
		$('body').removeAttr('style');
		$('#paywall-reader-interface').remove();
	}
	function SeekingAlpha() {
		$('body').removeAttr('style');
		$('[src*="chunk.SignInButton"]').prev().remove();
		$('.sticky-piano-placeholder').remove();
		waitForTargetElements('[data-test-id="article-content"]', removeContentHeightLock);
		waitForTargetElements('#paywall', removeDOMElement);
		waitForTargetElements('[src*="rollBar"]', removeDOMElement);
		waitForTargetElements('[src*="//js-sec.indexww.com/ht/p"]', removeDOMElement);
		waitForTargetElements('#px-captcha', removeDOMElement);
		waitForTargetElements('#px-captcha-wrapper', removeDOMElement);

		// Final pass removal - requires murdering cookies! :o
		var cookies = document.cookie.split(";");
		for (let key in cookies)
			clearCookie(cookies[key].split("=")[0], URL_HOSTNAME, '/');
	}
	function SFChronicle() {
		$('.fancybox-overlay').remove();
		$('html').removeAttr('class');
		$('.bcSlideOut').remove();
		$('body').attr('style', 'overflow: unset !important;');
	}
	function TheCut() {
		$('html').removeAttr('style');
		$('body').removeAttr('style');
		$('#paywall-reader-interface').remove();
	}
	function TheDailyBeast() {
		$('.tp-modal').remove();
		$('.tp-backdrop').remove();
		$('body').removeClass('tp-modal-open');
		$('[id*="offer-0-"]').remove();
		$('[displayname*="PianoTag"]').remove();
		$('[src*="tinypass.min.js"]').remove();
		$('#piano_bottom_ribbon_wrapper').remove();

		$('#Injected-By-Assassinate-Ad-Block-Blockers').remove();
		console.clear();
		console.log('blocker code removed');
	}
	function USAToday() {
		$('html').removeAttr('style');
		$('html').removeClass('sp-message-open');
		$('body').removeAttr('style');
		$('[class*="sp_veil"]').remove();
		$('[id*="sp_message_id"]').remove();
	}
	function Vulture() {
		$('html').removeAttr('style');
		$('body').removeAttr('style');
		$('#paywall-reader-interface').remove();
	}
	function WashingtonPost() {
		$('html').removeAttr('style');
		$('body').removeAttr('style');
		$('[data-qa*="paywall"]').remove();
		$('[rel*="apple-touch-icon"]').last().next().next().remove(); // removes the blocker html
		$('[rel*="apple-touch-icon"]').last().next().next().remove(); // removes the blocker styles
		waitForTargetElements('[id*="paywall-us-"]', removeDOMElement);
	}

	function domStatusCheck() {
		if (STANDARD_BLOCKER_DOMAINS.indexOf(URL_HOSTNAME) > -1)
			standardRemoval();

		if (AUXILIARY_BLOCKER_DOMAINS.indexOf(URL_HOSTNAME) > -1)
		{
			switch(URL_HOSTNAME)
			{
				case DOMAIN.GamesRadarAuxiliary:
					if (typeof currentStatus2 !== 'undefined')
						GamesRadar(currentStatus2);
					else
						GamesRadar();
					break;
			}
		}

		if (ABNORMAL_BLOCKER_DONAINS.indexOf(URL_HOSTNAME) > -1)
		{
			switch(URL_HOSTNAME)
			{
				case DOMAIN.BusinessInsider:		BusinessInsider(); break;
				case DOMAIN.BusinessInsiderMarkets:	BusinessInsider(); break;
				case DOMAIN.Curbed:					Curbed(); false;
				case DOMAIN.DailyMail: 				DailyMail(); break;
				case DOMAIN.EuroGamer: 				EuroGamer(); break;
				case DOMAIN.Forbes:					Forbes(); break;
				case DOMAIN.Insider: 				Insider(); break;
				case DOMAIN.LATimes: 				LATimes(); break;
				case DOMAIN.MakeUseOf:				MakeUseOf(); break;
				case DOMAIN.MercuryNews: 			MercuryNews(); break;
				case DOMAIN.NewYorkTimes:			NewYorkTimes(); break;
				case DOMAIN.NewYorkTimesCooking:	NewYorkTimes(); break;
				case DOMAIN.NYMag:					NYMag(); break;
				case DOMAIN.SFChronicle: 			SFChronicle(); break;
				case DOMAIN.TheCut:					TheCut(); break;
				case DOMAIN.USAToday: 				USAToday(); break;
				case DOMAIN.Vulture:				Vulture(); break;
				case DOMAIN.WashingtonPost: 		WashingtonPost(); break;
			}
		}
	}

	// Sledgehammer 1.0
	function sledgeHammerRemoval() {
		const REPEAT_INTERVAL = 1500; // 1.5 seconds
		switch (URL_HOSTNAME)
		{
			case DOMAIN.Bloomberg:			successRemovalMessage(); setTimeout(function() { Bloomberg(); }, REPEAT_INTERVAL); break;
			case DOMAIN.TheDailyBeast: 		successRemovalMessage(); setTimeout(function() { TheDailyBeast(); }, REPEAT_INTERVAL); break;
			case DOMAIN.NationalGeographic: successRemovalMessage(); setTimeout(function() { NationalGeographic(); }, REPEAT_INTERVAL); break;
			case DOMAIN.SeekingAlpha: 		successRemovalMessage(); setTimeout(function() { SeekingAlpha(); }, REPEAT_INTERVAL); break;
		}
	}

	sledgeHammerRemoval();

	function displayMessage(domain) {
		return console.log(`Final pass for ${ domain }`);
	}

	function clearAllIntervals() {
		successRemovalMessage();

		setTimeout(function() {

			console.clear();
			const TOTAL_TIMEOUTS = 10;

			if (URL_HOSTNAME != DOMAIN.TheDailyBeast)
			{
				switch(URL_HOSTNAME)
				{
					case DOMAIN.BusinessInsider: 		displayMessage(DOMAIN.BusinessInsider);			BusinessInsider(); break;
					case DOMAIN.BusinessInsiderMarkets:	displayMessage(DOMAIN.BusinessInsiderMarkets);	BusinessInsider(); break;
					case DOMAIN.Curbed:					displayMessage(DOMAIN.Curbed);					Curbed(); break;
					case DOMAIN.DailyMail: 				displayMessage(DOMAIN.DailyMail);				DailyMail(); break;
					case DOMAIN.EuroGamer: 				displayMessage(DOMAIN.EuroGamer);				EuroGamer(); break;
					case DOMAIN.Forbes: 				displayMessage(DOMAIN.Forbes);					Forbes(); break;
					case DOMAIN.Insider: 				displayMessage(DOMAIN.Insider);					Insider(); break;
					case DOMAIN.LATimes: 				displayMessage(DOMAIN.LATimes);					LATimes(); break;
					case DOMAIN.MakeUseOf: 				displayMessage(DOMAIN.MakeUseOf);				MakeUseOf(); break;
					case DOMAIN.MercuryNews: 			displayMessage(DOMAIN.MercuryNews);				MercuryNews(); break;
					case DOMAIN.NewYorkTimes: 			displayMessage(DOMAIN.NewYorkTimes);			NewYorkTimes(); break;
					case DOMAIN.NewYorkTimesCooking: 	displayMessage(DOMAIN.NewYorkTimesCooking);		NewYorkTimes(); break;
					case DOMAIN.NYMag:					displayMessage(DOMAIN.NYMag);					NYMag(); break;
					case DOMAIN.SeekingAlpha: 			displayMessage(DOMAIN.SeekingAlpha);			SeekingAlpha(); break;
					case DOMAIN.SFChronicle: 			displayMessage(DOMAIN.SFChronicle);				SFChronicle(); break;
					case DOMAIN.TheCut:					displayMessage(DOMAIN.TheCut);					TheCut(); break;
					case DOMAIN.USAToday: 				displayMessage(DOMAIN.USAToday);				USAToday(); break;
					case DOMAIN.Vulture:				displayMessage(DOMAIN.Vulture);					Vulture(); break;
					case DOMAIN.WashingtonPost: 		displayMessage(DOMAIN.WashingtonPost);			WashingtonPost(); break;
				}

				clearInterval('SledgehammerRemoval');
				console.log('Sledgehammer interval cleared');
			}
			for (let i = 1; i <= TOTAL_TIMEOUTS; i++)
			{
				let intervalName = 'currentStatus' + i;
				clearInterval(intervalName);
			}
			clearInterval(CI);
			console.log('all intervals cleared');

			$('#Injected-By-Assassinate-Ad-Block-Blockers').remove();
		}, 1500); // Wait 1.5 seconds
	}

    const PROCESSING_MESSAGE = 'Assassinate Ad Block Blockers is doing its jobs. Please wait a few seconds.';

    if (URL_HOSTNAME === DOMAIN.SeekingAlpha)
        startingRemovalMessage(`[Not 100%] ${ PROCESSING_MESSAGE } <u>Please note:</u> Cookies have to be deleted.`);
    else
        startingRemovalMessage(PROCESSING_MESSAGE);

    // Sets up listeners to supercede any blocker shenanigans
    if (STANDARD_BLOCKER_DOMAINS.indexOf(URL_HOSTNAME) > -1) { let currentStatus1 = setInterval(domStatusCheck, 50); } // deepscan-disable-line
    if (AUXILIARY_BLOCKER_DOMAINS.indexOf(URL_HOSTNAME) > -1) { let currentStatus2 = setInterval(domStatusCheck, 50); } // deepscan-disable-line

    // Second pass after 1.5 seconds
    if (STANDARD_BLOCKER_DOMAINS.indexOf(URL_HOSTNAME) > -1) { let currentStatus3 = setTimeout(domStatusCheck, 1500); } // deepscan-disable-line
    if (ABNORMAL_BLOCKER_DONAINS.indexOf(URL_HOSTNAME) > -1) { let currentStatus4 = setTimeout(domStatusCheck, 1500); } // deepscan-disable-line

    // Third pass after 2.5 seconds
    if (STANDARD_BLOCKER_DOMAINS.indexOf(URL_HOSTNAME) > -1) { let currentStatus5 = setTimeout(domStatusCheck, 2500); } // deepscan-disable-line
    if (ABNORMAL_BLOCKER_DONAINS.indexOf(URL_HOSTNAME) > -1) { let currentStatus6 = setTimeout(domStatusCheck, 2500); } // deepscan-disable-line

    // Fourth pass after 5.5 seconds
    if (STANDARD_BLOCKER_DOMAINS.indexOf(URL_HOSTNAME) > -1) { let currentStatus7 = setTimeout(domStatusCheck, 5500); } // deepscan-disable-line
    if (ABNORMAL_BLOCKER_DONAINS.indexOf(URL_HOSTNAME) > -1) { let currentStatus8 = setTimeout(domStatusCheck, 5500); } // deepscan-disable-line

    // Fifth pass after 7 seconds
    if (STANDARD_BLOCKER_DOMAINS.indexOf(URL_HOSTNAME) > -1) { let currentStatus9 = setTimeout(domStatusCheck, 7000); } // deepscan-disable-line
    if (ABNORMAL_BLOCKER_DONAINS.indexOf(URL_HOSTNAME) > -1) { let currentStatus10 = setTimeout(domStatusCheck, 7000); } // deepscan-disable-line

    // Last-pass guarantee after 7.05 seconds (We want this to fire immediately after the fifth pass)
    const CI = setTimeout(clearAllIntervals, 7050);

    // Perpetual check and removal every 2.5 seconds - The Peter Gabriel Sledgehammer Special
    if (ABNORMAL_BLOCKER_DONAINS.indexOf(URL_HOSTNAME) > -1) { setInterval(sledgeHammerRemoval, 2500); }

    console.clear();
}

// Load jQuery and then execute the main function
addJQuery(main);
