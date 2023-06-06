// Токен зашит в сам файл yandex-maps.js.
// Так сделано, потому что в ios приложении не проходит проверка на referrer.
// Поэтому загрузил скрипт в public.
export const loadYandexMapScript = (): Promise<void> => {
	return new Promise((res, rej) => {
		const script = document.createElement('script')

		script.src = '/yandex-maps.js'
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
