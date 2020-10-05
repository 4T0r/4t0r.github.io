import { isChrome, isBrave, isFirefox, getOS } from './modules/helpers.js'
import { patch, html, note, count, modal } from './modules/html.js'
import { hashMini, instanceId, hashify } from './modules/crypto.js'
import { decrypt } from './modules/decrypt.js'

import { captureError, attempt, caniuse, timer, errorsCaptured, getCapturedErrors } from './modules/captureErrors.js'
import { sendToTrash, proxyBehavior, gibberish, trustInteger, trashBin, getTrash } from './modules/trash.js'
import { documentLie, contentWindow, parentIframe, lieProps, lieRecords, getLies } from './modules/lies.js'

import { getOfflineAudioContext } from './modules/audio.js'
import { getCanvas2d } from './modules/canvas2d.js'
import { getCanvasBitmapRenderer } from './modules/canvasBitmap.js'
import { getCanvasWebgl } from './modules/canvasWebgl.js'
import { getCloudflare } from './modules/cloudflare.js'
import { getCSSStyleDeclarationVersion } from './modules/computedStyle.js'
import { getConsoleErrors } from './modules/consoleErrors.js'
import { getIframeContentWindowVersion } from './modules/contentWindowVersion.js'
import { getFonts, fontList, extendedFontList, googleFonts, notoFonts } from './modules/fonts.js'
import { getHTMLElementVersion } from './modules/htmlElementVersion.js'
import { getMaths } from './modules/maths.js'
import { getMediaDevices } from './modules/mediaDevices.js'
import { getMediaTypes } from './modules/mediaTypes.js'
import { getNavigator } from './modules/navigator.js'
import { getClientRects } from './modules/rects.js'
import { getScreen } from './modules/screen.js'
import { getTimezone } from './modules/timezone.js'
import { getVoices } from './modules/voices.js'
import { getWebRTCData } from './modules/webrtc.js'
import { getWorkerScope } from './modules/worker.js'

(async () => {
	'use strict';

	const decryptKnown = await decrypt({ require: [ hashMini ] })

	const imports = {
		require: {
			// helpers
			isChrome,
			isBrave,
			isFirefox,
			getOS,
			// crypto
			instanceId,
			hashMini,
			hashify,
			// html
			patch,
			html,
			note,
			count,
			modal,
			// decrypt
			decryptKnown,
			// captureErrors
			captureError,
			attempt,
			caniuse,
			// trash
			sendToTrash,
			proxyBehavior,
			gibberish,
			trustInteger,
			// lies
			documentLie,
			lieProps: lieProps().props,
			// collections
			errorsCaptured,
			trashBin,
			lieRecords,
			contentWindow
		}
	}

	const fingerprint = async () => {
		const timeStart = timer()
		const [
			workerScopeComputed,
			cloudflareComputed,
			iframeContentWindowVersionComputed,
			htmlElementVersionComputed,
			cssStyleDeclarationVersionComputed,
			screenComputed,
			voicesComputed,
			mediaDevicesComputed,
			mediaTypesComputed,
			canvas2dComputed,
			canvasBitmapRendererComputed,
			canvasWebglComputed,
			mathsComputed,
			consoleErrorsComputed,
			timezoneComputed,
			clientRectsComputed,
			offlineAudioContextComputed,
			fontsComputed
		] = await Promise.all([
			getWorkerScope(imports),
			getCloudflare(imports),
			getIframeContentWindowVersion(imports),
			getHTMLElementVersion(imports),
			getCSSStyleDeclarationVersion(imports),
			getScreen(imports),
			getVoices(imports),
			getMediaDevices(imports),
			getMediaTypes(imports),
			getCanvas2d(imports),
			getCanvasBitmapRenderer(imports),
			getCanvasWebgl(imports),
			getMaths(imports),
			getConsoleErrors(imports),
			getTimezone(imports),
			getClientRects(imports),
			getOfflineAudioContext(imports),
			getFonts(imports, [...fontList, ...notoFonts])
		]).catch(error => {
			console.error(error.message)
		})
		const webRTCDataComputed = await getWebRTCData(imports, cloudflareComputed)
		const navigatorComputed = await getNavigator(imports, workerScopeComputed)
		const [
			liesComputed,
			trashComputed,
			capturedErrorsComputed
		] = await Promise.all([
			getLies(imports),
			getTrash(imports),
			getCapturedErrors(imports)
		]).catch(error => {
			console.error(error.message)
		})

		const timeEnd = timeStart()

		if (parentIframe) {
			parentIframe.remove()
		}

		const fingerprint = {
			workerScope: workerScopeComputed,
			cloudflare: cloudflareComputed,
			webRTC: webRTCDataComputed,
			navigator: navigatorComputed,
			iframeContentWindowVersion: iframeContentWindowVersionComputed,
			htmlElementVersion: htmlElementVersionComputed,
			cssStyleDeclarationVersion: cssStyleDeclarationVersionComputed,
			screen: screenComputed,
			voices: voicesComputed,
			mediaDevices: mediaDevicesComputed,
			mediaTypes: mediaTypesComputed,
			canvas2d: canvas2dComputed,
			canvasBitmapRenderer: canvasBitmapRendererComputed,
			canvasWebgl: canvasWebglComputed,
			maths: mathsComputed,
			consoleErrors: consoleErrorsComputed,
			timezone: timezoneComputed,
			clientRects: clientRectsComputed,
			offlineAudioContext: offlineAudioContextComputed,
			fonts: fontsComputed,
			lies: liesComputed,
			trash: trashComputed,
			capturedErrors: capturedErrorsComputed
		}
		return { fingerprint, timeEnd }
	}
	// get/post request
	const webapp = 'https://script.google.com/macros/s/AKfycbzKRjt6FPboOEkh1vTXttGyCjp97YBP7z-5bODQmtSkQ9BqDRY/exec'
	
	// fingerprint and render
	const { fingerprint: fp, timeEnd } = await fingerprint().catch(error => console.error(error))
	
	// Trusted Fingerprint
	const distrust = { distrust: { brave: isBrave, firefox: isFirefox } }
	const trashLen = fp.trash.trashBin.length
	const liesLen = !('data' in fp.lies) ? 0 : fp.lies.data.length
	const errorsLen = fp.capturedErrors.data.length
	const creep = {
		workerScope: fp.workerScope ? {
			canvas2d: (
				(isBrave || isFirefox) ? distrust : 
				fp.workerScope.canvas2d
			),
			hardwareConcurrency: (
				isBrave ? distrust : 
				fp.workerScope.hardwareConcurrency
			),
			language: fp.workerScope.language,
			platform: fp.workerScope.platform,
			system: fp.workerScope.system,
			['timezone offset']: fp.workerScope['timezone offset'],
			['webgl renderer']: fp.workerScope['webgl renderer'],
			['webgl vendor']: fp.workerScope['webgl vendor']
		} : undefined,
		mediaDevices: !isBrave ? fp.mediaDevices : distrust,
		mediaTypes: fp.mediaTypes,
		canvas2d: (
			(isBrave || isFirefox) ? distrust : 
			!fp.canvas2d || fp.canvas2d.lied ? undefined : 
			fp.canvas2d
		),
		canvasBitmapRenderer: (
			(isBrave || isFirefox) ? distrust : 
			!fp.canvasBitmapRenderer || fp.canvasBitmapRenderer.lied ? undefined : 
			fp.canvasBitmapRenderer
		),
		canvasWebgl: isBrave ? distrust : !fp.canvasWebgl || fp.canvasWebgl.lied ? undefined : {
			supported: fp.canvasWebgl.supported,
			supported2: fp.canvasWebgl.supported2,
			dataURI: isFirefox ? distrust : fp.canvasWebgl.dataURI,
			dataURI2: isFirefox ? distrust : fp.canvasWebgl.dataURI2,
			matchingDataURI: fp.canvasWebgl.matchingDataURI,
			matchingUnmasked: fp.canvasWebgl.matchingUnmasked,
			specs: fp.canvasWebgl.specs,
			unmasked: fp.canvasWebgl.unmasked,
			unmasked2: fp.canvasWebgl.unmasked2
		},
		maths: !fp.maths || fp.maths.lied ? undefined : fp.maths,
		consoleErrors: fp.consoleErrors,
		iframeContentWindowVersion: fp.iframeContentWindowVersion,
		htmlElementVersion: fp.htmlElementVersion,
		cssStyleDeclarationVersion: fp.cssStyleDeclarationVersion,
		// avoid random timezone fingerprint values
		timezone: !fp.timezone || fp.timezone.lied ? undefined : fp.timezone,
		clientRects: !fp.clientRects || fp.clientRects.lied ? undefined : fp.clientRects,
		offlineAudioContext: (
			isBrave ? distrust :
			!fp.offlineAudioContext || fp.offlineAudioContext.lied ? undefined :
			fp.offlineAudioContext
		),
		fonts: fp.fonts,
		trash: !!trashLen,
		lies: !('data' in fp.lies) ? false : !!liesLen,
		capturedErrors: !!errorsLen,
		voices: fp.voices
	}
	const debugLog = (message, obj) => console.log(message, JSON.stringify(obj, null, '\t'))
	
	console.log('Fingerprint (Object):', creep)
	console.log('Loose Fingerprint (Object):', fp)
	//debugLog('Loose Id (JSON):', fp)
	
	const [fpHash, creepHash] = await Promise.all([hashify(fp), hashify(creep)])
	.catch(error => { 
		console.error(error.message)
	})
	
	const { trash: hasTrash, lies: hasLied, capturedErrors: hasErrors } = creep

	// post useragent 
	fetch(
		`/?distrust=${hasLied}&errors=${fp.consoleErrors.$hash}&math=${fp.maths.$hash}&html=${fp.htmlElementVersion.$hash}&win=${fp.iframeContentWindowVersion.$hash}&style=${fp.cssStyleDeclarationVersion.getComputedStyle.$hash}&system=${fp.cssStyleDeclarationVersion.system.$hash}&ua=${fp.navigator.userAgent}&uaSystem=${fp.navigator.system}`,
		{ method: 'POST' }
	)
	.then(response => console.log('useragent post success') )
	.catch(error => console.log('useragent post failed') )

	// fetch data from server
	const id = 'creep-browser'
	const visitorElem = document.getElementById(id)
	const fetchVisitoDataTimer = timer('Fetching visitor data...')
	fetch(`${webapp}?id=${creepHash}&subId=${fpHash}&hasTrash=${hasTrash}&hasLied=${hasLied}&hasErrors=${hasErrors}`)
		.then(response => response.json())
		.then(data => {
			console.log(data)
			const { firstVisit, latestVisit, subIds, visits, hasTrash, hasLied, hasErrors } = data
			const subIdsLen = Object.keys(subIds).length
			const toLocaleStr = str => {
				const date = new Date(str)
				const dateString = date.toDateString()
				const timeString = date.toLocaleTimeString()
				return `${dateString}, ${timeString}`
			}
			const hoursAgo = (date1, date2) => Math.abs(date1 - date2) / 36e5
			const hours = hoursAgo(new Date(firstVisit), new Date(latestVisit)).toFixed(1)

			// trust score
			const score = (100-(
				(subIdsLen < 2 ? 0 : subIdsLen-1 < 11 ? (subIdsLen-1) * 1 : (subIdsLen-1) * 5 ) +
				(errorsLen * 5.2) +
				(trashLen * 15.5) +
				(liesLen * 31)
			)).toFixed(0)
			const template = `
				<div class="visitor-info">
					<strong>Browser</strong>
					<div>trust score: ${
						score > 95 ? `${score}% <span class="grade-A">A+</span>` :
						score == 95 ? `${score}% <span class="grade-A">A</span>` :
						score >= 90 ? `${score}% <span class="grade-A">A-</span>` :
						score > 85 ? `${score}% <span class="grade-B">B+</span>` :
						score == 85 ? `${score}% <span class="grade-B">B</span>` :
						score >= 80 ? `${score}% <span class="grade-B">B-</span>` :
						score > 75 ? `${score}% <span class="grade-C">C+</span>` :
						score == 75 ? `${score}% <span class="grade-C">C</span>` :
						score >= 70 ? `${score}% <span class="grade-C">C-</span>` :
						score > 65 ? `${score}% <span class="grade-D">D+</span>` :
						score == 65 ? `${score}% <span class="grade-D">D</span>` :
						score >= 60 ? `${score}% <span class="grade-D">D-</span>` :
						score > 55 ? `${score}% <span class="grade-F">F+</span>` :
						score == 55 ? `${score}% <span class="grade-F">F</span>` :
						`${score < 0 ? 0 : score}% <span class="grade-F">F-</span>`
					}</div>
					<div>visits: ${visits}</div>
					<div class="ellipsis">first: ${toLocaleStr(firstVisit)}
					<div class="ellipsis">last: ${toLocaleStr(latestVisit)}</div>
					<div>persistence: ${hours} hours</div>
					<div>has trash: ${
						(''+hasTrash) == 'true' ?
						`true [${hashMini(fp.trash)}]` : 
						'false'
					}</div>
					<div>has lied: ${
						(''+hasLied) == 'true' ? 
						`true [${hashMini(fp.lies)}]` : 
						'false'
					}</div>
					<div>has errors: ${
						(''+hasErrors) == 'true' ? 
						`true [${hashMini(fp.capturedErrors)}]` : 
						'false'
					}</div>
					<div>loose fingerprints: ${subIdsLen}</div>
					<div>bot: ${subIdsLen > 10 && hours < 48 ? 'true [10 loose fingerprints within 48 hours]' : 'false'}</div>
				</div>
			`
			fetchVisitoDataTimer('Visitor data received')
			return patch(visitorElem, html`${template}`)
		})
		.catch(err => {
			fetchVisitoDataTimer('Error fetching visitor data')
			patch(visitorElem, html`<div>Error fetching data: <a href="https://status.cloud.google.com" target="_blank">status.cloud.google.com</a></div>`)
			return console.error('Error!', err.message)
		})

	const el = document.getElementById('creep-fingerprint')
	patch(el, html`
	<div class="fingerprint-header">
		<strong>Fingerprint</strong>
		<div class="trusted-fingerprint ellipsis">${creepHash}</div>
		<div class="ellipsis">loose fingerprint: ${fpHash}</div>
		<div class="time ellipsis">performance: ${timeEnd} milliseconds</div>
	</div>
	`)
})()