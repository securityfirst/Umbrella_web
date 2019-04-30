export const generateForm = (form, formSaved) => {
	if (typeof window === 'undefined') return false

	if (
		!form || 
		!form.title || 
		!form.screens ||
		!form.screens.length ||
		!formSaved || 
		!formSaved.state ||
		!formSaved.state.length
	) {
		alert('Something went wrong. Please refresh the page and try again.')
		return false
	}

	try {
		return `
			<h1>${form.title}</h1>
			${form.screens.map((screen, i) => `
				<h2>${screen.title}</h2>
				${screen.items.map((item, i) => {
					switch (item.type) {
						case 'text_input': 
						case 'text_area': 
						case 'single_choice': 
							return `
								<h3>${item.label}</h3>
								<p>${formSaved.state[i][item.name] || ''}</p>
							`
						case 'multiple_choice': 
							return `
								<h3>${item.label}</h3>
								<ul>
									${!!formSaved.state[i][item.name]
										? formSaved.state[i][item.name].map(li => `<li>${li}</li>`)
										: ''
									}
								</ul>
							`
					}
				})}
			`)}
		`
	} catch (e) {
		throw e
	}
}