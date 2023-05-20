export const loadScript = (src: string): Promise<void> => {
	return new Promise((res, rej) => {
		const script = document.createElement('script')

		script.src = src
		script.async = false

		script.onload = () => {
			res()
		}

		script.onerror = (error) => {
			rej(error)
		}

		document.head.appendChild(script);
	})
}
