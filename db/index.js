import localforage from 'localforage'

class ClientDB {
	constructor() {
		if (typeof window === 'undefined') throw new Error('[ClientDB] Cannot initialize serverside')

		this.store = null
	}

	init() {
		return new Promise((resolve, reject) => {
			if (this.store) return resolve()

			try {
				this.store = localforage.createInstance({
					name: 'umbrella',
					storeName: 'store',
					description: 'Local data store',
				})

				this.store
					.getItem('enabled')
					.then(val => {
						if (!val) this.store.setItem('enabled', false)
						resolve(this.store)
					})
			} catch (e) {
				console.error('[ClientDB] init() exception: \n', e)
				return reject(e)
			}
		})
	}

	clear() {
		return this.store.clear()
	}

	enable() {
		return this.store.setItem('enabled', true)
	}

	disable(clear) {
		return new Promise((resolve, reject) => {
			try {
				this.store
					.setItem('enabled', false)
					.then(resolve)

				if (clear) this.store.clear()
			} catch (e) {
				console.error('[ClientDB] clearAll() exception: \n', e)
				reject(e)
			}
		})
	}
}

export default ClientDB