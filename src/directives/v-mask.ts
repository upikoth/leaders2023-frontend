import type { IonInput } from '@ionic/vue'

interface IHtmlMaskedInputElement extends HTMLInputElement {
	isMaskReady: boolean
}

interface ICustomEventTarget extends EventTarget {
	value: string
}

interface ICustomEvent extends Event {
	target: ICustomEventTarget
}

function initMask (el: IHtmlMaskedInputElement, pipe: (value: string) => string) {
	el.addEventListener('input', (e) => {
		const event = e as ICustomEvent
		event.target.value = pipe(event.target.value)
	}, true)

	el.value = pipe(el.value)
	el.isMaskReady = true
}

export default {
	mounted: async (el: typeof IonInput, { value }: { value: (value: string) => string }) => {
		const nativeInputElement = await el.getInputElement() as IHtmlMaskedInputElement | undefined

		if (nativeInputElement) {
			initMask(nativeInputElement, value)
		}
	},

	updated: (el: typeof IonInput, { value }: { value: (value: string) => string }) => {
		setTimeout(async () => {
			const nativeInputElement = await el.getInputElement() as IHtmlMaskedInputElement | undefined

			if (nativeInputElement && !nativeInputElement.isMaskReady) {
				initMask(nativeInputElement, value)
			}
		})
	},
}
