export const formatPrice = (value: number | string): string =>
	Number(value).toLocaleString('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 0,
		minimumFractionDigits: 0
	});
