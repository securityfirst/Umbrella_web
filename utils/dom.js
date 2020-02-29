import * as Blob from 'blob'

export const downloadPdf = (name = 'download', marked) => {
	if (typeof window === 'undefined') return false

	if (!name || !marked) {
		alert('Something went wrong. Please refresh the page and try again.')
		return false
	}

	try {
		const date = new Date()
		const filename = `Umbrella_${name.trim()}_${date.valueOf()}.pdf`
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
		const html = 
			`<!doctype html>
			<html>
				<head>
					<link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css" integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47" crossorigin="anonymous">
					<style>
						body {
							max-width: 960px;
							margin: 2rem auto;
							font-size: 16px;
							background-color: #ECECEC;
							-ms-text-size-adjust: 100%;
							-webkit-text-size-adjust: 100%;
							line-height: 1.5;
							color: #24292E;
							font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
							font-size: 16px;
							line-height: 1.5;
							word-wrap: break-word;
						}
						h1 {
							text-transform: capitalize;
						}
						a {
							color: #0366D6;
							text-decoration: none;
						}
						#content {
							background-color: white;
							padding: 1rem 2rem;
						}
						#title {
							margin-bottom: 0;
						}
						#subtitle {
							margin-top: 0;
							color: #5E5E5E;
							text-transform: capitalize;
						}
						#checklist ul {
							list-style: none;
							padding-inline-start: 0;
						}
					</style>
				</head>
				<body>
					<div id="content">
						${marked}
					</div>
				</body>
			</html>
			`
		const blob = new Blob([html], {type : 'application/html'})
		const url = 'data:text/html;charset=utf-8,' + encodeURIComponent(html)

		save(blob, url, name.trim() + '.html')
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
		
		save(blob, url, name.trim() + '.docx')
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