import 'isomorphic-unfetch'
import atob from 'atob'
import marked from 'marked'

export const downloadLesson = (name, sha) => {
	if (typeof window === 'undefined') return false

	if (!name || !sha) {
		alert('Something went wrong. Please refresh the page and try again.')
		return false
	}

	fetch(`${process.env.ROOT}/api/github/content/${sha}`)
		.then(res => {
			if (!res.ok) throw res
			return res.text()
		})
		.then(content => {
			const date = new Date()
			const filename = `Umbrella_${name}_${date.valueOf()}.pdf`
			const jsPDF = require('jspdf')
			const html2canvas = require('html2canvas')

			let placeholder = document.createElement('div')
			placeholder.id = `pdf-${sha}`
			placeholder.className += 'markdown-body'
			placeholder.setAttribute('style', 'position:absolute;z-index:-1;width:100vw;margin:1rem;')
			placeholder.innerHTML = marked(atob(content))
			document.body.appendChild(placeholder)

			html2canvas(document.querySelector(`#pdf-${sha}`)).then(canvas => {
				const imageHeight = parseInt((201 * canvas.height) / canvas.width)
				let pdf = new jsPDF({format: 'a4', orientation: 'portrait', unit: 'mm'})
				pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 0, 201, imageHeight)
				pdf.save(filename)
				placeholder.remove()
			})
		})
		.catch(err => {
			console.error('downloadLesson error: ', err)
			alert('Something went wrong. Please refresh the page and try again.')
		})
}