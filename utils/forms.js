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
			${form.screens.map((screen, i) => {
				return `
					<h2 style="margin-top:40px">${screen.title}</h2>
					${screen.items.map(item => {
						switch (item.type) {
							case 'text_input': 
							case 'text_area': 
							case 'single_choice': 
								return `
									<h3 style="display:inline-block;margin:5px 0;">${item.label} </h3>
									<span>${formSaved.state[i][item.name] || 'N/A'}</span>
									<br/>
								`
							case 'multiple_choice': 
								const values = !!formSaved.state[i][item.name]
									? formSaved.state[i][item.name].map(li => `<li>${li}</li>`).join('')
									: 'N/A'

								return `
									<h3>${item.label}</h3>
									<ul>${values}</ul>
								`
						}
					}).join('')}
				`
			}).join('')}
		`
	} catch (e) {
		throw e
	}
}

export const generateChecklist = (checklist, percentage) => {
	if (typeof window === 'undefined') return false

	if (
		!checklist || 
		!checklist.name ||
		isNaN(percentage)
	) {
		alert('Something went wrong. Please refresh the page and try again.')
		return false
	}

	try {
		return `
			<h1>${checklist.name}</h1>
			<h2>${percentage}%</h2>
			${(checklist.items && checklist.items.length)
				? `<ul>${checklist.items.map((item, i) => {
					return `<li><strong>${item.text}</strong>: ${item.done ? '✓' : '✕'}</li>`
				}).join('')}</ul>`
				: ''}
		`
	} catch (e) {
		throw e
	}
}