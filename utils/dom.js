import htmlDocx from 'html-docx-js/dist/html-docx'
import 'html-docx-js/test/vendor/Blob'

export const download = (name, marked) => {
	if (typeof window === 'undefined') return false

	if (!name || !marked) {
		alert('Something went wrong. Please refresh the page and try again.')
		return false
	}

	try {
		const date = new Date()
		const filename = `Umbrella_${name}_${date.valueOf()}.pdf`
		const jsPDF = require('jspdf')
		const html2canvas = require('html2canvas')

		let placeholder = document.createElement('div')
		const id = `pdf-${parseInt(Math.random() * 100)}`
		placeholder.id = id
		placeholder.className += 'markdown-body'
		placeholder.setAttribute('style', 'position:absolute;z-index:-1;width:100vw;margin:1rem;')
		placeholder.innerHTML = marked
		document.body.appendChild(placeholder)

		html2canvas(placeholder, {
			scale: 2,
			logging: process.env.NODE_ENV !== 'production',
		}).then(canvas => {
			const letterWidth = 195
			const imageHeight = parseInt((letterWidth * canvas.height) / canvas.width)
			let pdf = new jsPDF({format: 'letter', orientation: 'portrait', unit: 'mm'})
			pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 0, letterWidth, imageHeight)
			pdf.save(filename)
			placeholder.remove()
		})
	} catch (e) {
		throw e
	}
}

export const downloadHtml = (name, marked) => {
	const saveAs = require('html-docx-js/test/vendor/FileSaver')
	const html = `<!doctype html><html><head></head><body>${marked}</body></html>`
	const blob = new Blob([html], {type : 'application/html'})

	saveAs(blob, `${name}.html`)
}

export const downloadDocx = async (name, marked) => {
	const saveAs = require('html-docx-js/test/vendor/FileSaver')
	const html = `<!doctype html><html><head></head><body>${marked}</body></html>`
	const blob = htmlDocx.asBlob(html)

	saveAs(blob, `${name}.docx`)
}