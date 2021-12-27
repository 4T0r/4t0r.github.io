export const getSVG = async imports => {

	const {
		require: {
			instanceId,
			patch,
			html,
			captureError,
			lieProps,
			logTestResult,
			phantomDarkness
		}
	} = imports
	
	try {
		const start = performance.now()
		let lied = (
			lieProps['SVGRect.height'] ||
			lieProps['SVGRect.width'] ||
			lieProps['SVGRect.x'] ||
			lieProps['SVGRect.y']
		) || false // detect lies
						
		const doc = phantomDarkness ? phantomDarkness.document : document

		const emojis = [[128512],[9786],[129333, 8205, 9794, 65039],[9832],[9784],[9895],[8265],[8505],[127987, 65039, 8205, 9895, 65039],[129394],[9785],[9760],[129489, 8205, 129456],[129487, 8205, 9794, 65039],[9975],[129489, 8205, 129309, 8205, 129489],[9752],[9968],[9961],[9972],[9992],[9201],[9928],[9730],[9969],[9731],[9732],[9976],[9823],[9937],[9000],[9993],[9999],[10002],[9986],[9935],[9874],[9876],[9881],[9939],[9879],[9904],[9905],[9888],[9762],[9763],[11014],[8599],[10145],[11013],[9883],[10017],[10013],[9766],[9654],[9197],[9199],[9167],[9792],[9794],[10006],[12336],[9877],[9884],[10004],[10035],[10055],[9724],[9642],[10083],[10084],[9996],[9757],[9997],[10052],[9878],[8618],[9775],[9770],[9774],[9745],[10036],[127344],[127359]].map(emojiCode => String.fromCodePoint(...emojiCode))

		const svgId = `${instanceId}-svg-div`
		const divElement = document.createElement('div')
		divElement.setAttribute('id', svgId)
		doc.body.appendChild(divElement)
		const divRendered = doc.getElementById(svgId)
		
		// patch div
		patch(divRendered, html`
		<div id="${svgId}">
			<div id="svg-container">
				<style>
				#svg-container {
					position: absolute;
					left: -9999px;
					height: auto;
				}
				#svgText {
					font-family: monospace !important;
					font-size: 100px;
					font-style: normal;
					font-weight: normal;
					letter-spacing: normal;
					line-break: auto;
					line-height: normal;
					text-transform: none;
					text-align: left;
					text-decoration: none;
					text-shadow: none;
					white-space: normal;
					word-break: normal;
					word-spacing: normal;
				}
				</style>
				<svg>
					<g id="svgBox">
						<text id="svgText" x="32" y="32" transform="scale(100)">${emojis.join('')}</text>
					</g>
				</svg>
			</div>
		</div>
		`)
		
		const svgBox = doc.getElementById('svgBox')
		const svgText = doc.getElementById('svgText')
		
		const reduceToObject = nativeObj => {
			const keys = Object.keys(nativeObj.__proto__)
			return keys.reduce((acc, key) => {
				const val = nativeObj[key]
				const isMethod = typeof val == 'function'
				return isMethod ? acc : {...acc, [key]: val}
			}, {})
		}
		const reduceToSum = nativeObj => {
			const keys = Object.keys(nativeObj.__proto__)
			return keys.reduce((acc, key) => {
				const val = nativeObj[key]
				return isNaN(val) ? acc : (acc += val)
			}, 0)
		}
		const getListSum = list => list.reduce((acc, n) => acc += n, 0)
		const getObjectSum = obj => !obj ? 0 : Object.keys(obj).reduce((acc, key) => acc += Math.abs(obj[key]), 0)
		
		// SVGRect
		const bBox = reduceToObject(svgBox.getBBox())

		// compute SVGRect emojis
		const lengthSet = {
			extentOfChar: new Set(),
			subStringLength: new Set(),
			computedTextLength: new Set()
		}
		const emojiSet = emojis.reduce((emojiSet, emoji) => {
			svgText.textContent = emoji
			const extentOfCharSum = reduceToSum(svgText.getExtentOfChar(''))
			const subStringLength = svgText.getSubStringLength(0, 10)
			const computedTextLength = svgText.getComputedTextLength()

			if (!lengthSet.extentOfChar.has(extentOfCharSum)) {
				lengthSet.extentOfChar.add(extentOfCharSum)
				emojiSet.add(emoji)
			}
			if (!lengthSet.subStringLength.has(subStringLength)) {
				lengthSet.subStringLength.add(subStringLength)
				emojiSet.add(emoji)
			}
			if (!lengthSet.computedTextLength.has(computedTextLength)) {
				lengthSet.computedTextLength.add(computedTextLength)
				emojiSet.add(emoji)
			}
			return emojiSet
		}, new Set())

		logTestResult({ start, test: 'svg', passed: true })

		return {
			bBox: getObjectSum(bBox),
			extentOfChar: getListSum([...lengthSet.extentOfChar]),
			subStringLength: getListSum([...lengthSet.subStringLength]),
			computedTextLength: getListSum([...lengthSet.computedTextLength]),
			emojiSet: [...emojiSet],
			lied
		}
	}
	catch (error) {
		logTestResult({ test: 'svg', passed: false })
		captureError(error)
		return
	}
}

export const svgHTML = ({ fp, note, hashSlice, hashMini }) => {
	if (!fp.svg) {
		return `
		<div class="col-six undefined">
			<strong>SVGRect</strong>
			<div>bBox: ${note.blocked}</div>
			<div>char: ${note.blocked}</div>
			<div>subs: ${note.blocked}</div>
			<div>text: ${note.blocked}</div>
			<div class="block-text">${note.blocked}</div>
		</div>`
	}
	const {
		svg: {
			$hash,
			bBox,
			subStringLength,
			extentOfChar,
			computedTextLength,
			emojiSet,
			lied
		}
	} = fp
	const divisor = 10000
	const formatEmojiSet = emojiSet => (
		emojiSet.length > 9 ? `${emojiSet.slice(0, 3).join('')}...${emojiSet.slice(-3).join('')}` :
			emojiSet.join('')
	)
	const helpTitle = `hash: ${hashMini(emojiSet)}\n${emojiSet.map((x,i) => i && (i % 6 == 0) ? `${x}\n` : x).join('')}`
	return `
	<div class="col-six${lied ? ' rejected' : ''}">
		<strong>SVGRect</strong><span class="${lied ? 'lies ' : ''}hash">${hashSlice($hash)}</span>
		<div class="help" title="SVGGraphicsElement.getBBox()">bBox: ${bBox ? (bBox/divisor) : note.blocked}</div>
		<div class="help" title="SVGTextContentElement.getExtentOfChar()">char: ${extentOfChar ? (extentOfChar/divisor) : note.blocked}</div>
		<div class="help" title="SVGTextContentElement.getSubStringLength()">subs: ${subStringLength ? (subStringLength/divisor) : note.blocked}</div>
		<div class="help" title="SVGTextContentElement.getComputedTextLength()">text: ${computedTextLength ? (computedTextLength/divisor) : note.blocked}</div>
		<div class="block-text jumbo grey help" title="${helpTitle}">${formatEmojiSet(emojiSet)}</div>
	</div>
	`	
}
		