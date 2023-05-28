export interface IGetFileFromComputedOptions {
	accept?: string;
	multiple?: boolean;
}

export const getFilesFromComputer = (
	callback: (file: FileList) => void,
	{ accept, multiple }: IGetFileFromComputedOptions = {},
): void => {
	const input = document.createElement('input');
	input.style.display = 'none';
	input.type = 'file';

	if (multiple) {
		input.multiple = true;
	}

	if (accept) {
		input.accept = accept;
	}

	const onInputChange = () => {
		if (input.files) {
			callback(input.files);
		}

		input.removeEventListener('change', onInputChange);
		input.remove();
	};

	input.addEventListener('change', onInputChange);
	input.click();
};

export const getBase64FromFile = (file: File): Promise<string> => {
	return new Promise((res, rej) => {
		const reader = new FileReader();

		reader.readAsDataURL(file);
		reader.onload = function () {
			if (typeof(reader.result) !== 'string') {
				rej(new Error('Не удалось загрузить файл'))
				return
			}

			res(reader.result);
		};

		reader.onerror = function (error) {
			rej(error)
		};
	})
}

export const saveFile = (value: Blob | string, filename?: string): void => {
	const url = typeof value === 'string' ? value : window.URL.createObjectURL(value);

	const a = document.createElement('a');
	document.body.appendChild(a);
	a.href = url;
	a.target = '_blank'
	if (filename) {
		a.download = filename;
	}
	a.click();

	setTimeout(() => {
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	}, 0);
};
