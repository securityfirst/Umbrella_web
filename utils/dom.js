import 'isomorphic-unfetch'
import atob from 'atob'
import marked from 'marked'

export const download = (name, sha) => {
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

			window.html2canvas = html2canvas

			let doc = new jsPDF({format: 'letter', orientation: 'portrait'})

			const html = `
				<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0//EN" "http://www.w3.org/TR/REC-html40/strict.dtd">
				<html>
					<head>
						<style type="text/css">
							html {
								font: 16px/1 Verdana, sans-serif;
								color: black;
							}
							body {
								margin: 24px;
								padding: 0;
								width: 100%;
								background-color: white;
							}
							h1, h2, h3, h4, h5, h6, h7,
							blockquote,
							form,
							p {
								width: 100%;
							}
							ul {
								margin: 0;
								border: 0;
								padding: 0;
							}
							li {
								width: 100%;
								margin: 0;
								border: .5em solid black;
								padding: 1em;
								float: left;
								background-color: #FC0;
							}
							form {
								margin: 0;
								display: inline;
							}
							form p {
								line-height: 1.9;
							}
							dl {
								margin: 0;
								border: 0;
								padding: .5em;
							}
							dt {
								background-color: rgb(204,0,0);
								margin: 0;
								padding: 1em;
								width: 10.638%; /* refers to parent element's width of 47em. = 5em or 50px */
								height: 28em;
								border: .5em solid black;
								float: left;
							}
							dd {
								float: right;
								margin: 0 0 0 1em;
								border: 1em solid black;
								padding: 1em;
								width: 34em;
								height: 27em;
							}
						</style>
					</head>
					<body>
						${marked(atob(content))}
					</body>
				</html>
			`
			console.log("html: ", html);

			doc.html(html, {
				html2canvas: {
					scale: .75,
					width: 310,
					letterRendering: true,
				},
				callback: pdf => {
					pdf.save(filename)
				}
			})
			
		})
		.catch(err => {
			console.error(err)
			alert('Something went wrong. Please refresh the page and try again.')
		})

}