import IMask from 'imask'

export const maskPhone = IMask.createPipe({
	mask: '+{7} (000) 000-00-00'
}, IMask.PIPE_TYPE.MASKED) as (value: string) => string

export const unmaskPhone = IMask.createPipe({
	mask: '+{7} (000) 000-00-00'
}, IMask.PIPE_TYPE.MASKED, IMask.PIPE_TYPE.UNMASKED) as (value: string) => string

export const maskPricePerHour = IMask.createPipe({
	mask: Number,
	min: 0,
	max: 100000,
}, IMask.PIPE_TYPE.MASKED) as (value: string) => string

export const unmaskPricePerHour = IMask.createPipe({
	mask: Number,
	min: 0,
	max: 100000,
}, IMask.PIPE_TYPE.MASKED, IMask.PIPE_TYPE.UNMASKED) as (value: string) => string

export const maskWorkDay = IMask.createPipe({
	mask: 'hh:mm - hh:mm',
	blocks: {
		hh: {
			mask: '00',
		},
		mm: {
			mask: IMask.MaskedRange,
			//@ts-ignore
			from: '00',
			//@ts-ignore
			to: '00',
		},
	},
}, IMask.PIPE_TYPE.MASKED) as (value: string) => string
