import * as Blob from 'blob'

export const downloadPdf = (name = 'download', marked) => {
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
		console.error(e)
		throw e
	}
}

export const downloadHtml = (name = 'download', marked) => {
	if (typeof window === 'undefined') return false

	if (!marked) {
		alert('Something went wrong. Please refresh the page and try again.')
		return false
	}

	try {
		const html = `<!doctype html><html><head></head><body>${marked}</body></html>`
		const blob = new Blob([html], {type : 'application/html'})
		const url = 'data:text/html;charset=utf-8,,' + encodeURIComponent(html)

		save(blob, url, name + '.html')
	} catch (e) {
		console.error(`Failed to download ${name}.html: `, e)
		throw e
	}
}

export const downloadDocx = async (name = 'download', marked) => {
	if (typeof window === 'undefined') return false

	if (!marked) {
		alert('Something went wrong. Please refresh the page and try again.')
		return false
	}

	try {
		const html = `
			<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
				<head><meta charset='utf-8'><title>${name}</title></head>
				<body>${marked}</body>
			</html>
		`
		const blob = new Blob(['\ufeff', html], {type: 'application/msword'})
		const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)
		
		save(blob, url, name + '.docx')
	} catch (e) {
		console.error(`Failed to download ${name}.docx: `, e)
		throw e
	}
}

function save(blob, url, filename) {
	// Create download link element
	const downloadLink = document.createElement('a')

	document.body.appendChild(downloadLink)
	
	if (navigator.msSaveOrOpenBlob) {
		navigator.msSaveOrOpenBlob(blob, filename)
	} else {
		// Create a link to the file
		downloadLink.href = url
		
		// Setting the file name
		downloadLink.download = filename
		
		//triggering the function
		downloadLink.click()
	}
	
	document.body.removeChild(downloadLink)
}