import htmlDocx from 'html-docx-js/dist/html-docx'
import 'html-docx-js/test/vendor/Blob'

export const download = (name, html) => {
	if (typeof window === 'undefined') return false

	if (!name || !html) {
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
		placeholder.innerHTML = html
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

export const downloadHtml = () => {

}

export const downloadDocx = async (name, marked) => {
	const saveAs = require('html-docx-js/test/vendor/FileSaver')
	const html = `<!DOCTYPE html><html><body>${marked}</body></html>`
	console.log("html: ", html);
	const converted = htmlDocx.asBlob(html, {orientation: 'portrait'})
	console.log("converted: ", converted);

	saveAs(converted, `${name}.docx`)
}