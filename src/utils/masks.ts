import IMask from 'imask'

export const maskPhone = IMask.createPipe({
	mask: '+{7} (000) 000-00-00'
}, IMask.PIPE_TYPE.MASKED) as (value: string) => string

export const unmaskPhone = IMask.createPipe({
	mask: '+{7} (000) 000-00-00'
}, IMask.PIPE_TYPE.MASKED, IMask.PIPE_TYPE.UNMASKED) as (value: string) => string
