import localforage from 'localforage'

localforage.config({
	name: 'umbrella',
	description: 'Local data store for the Umbrella web client'
});

class ClientDB {
	constructor() {
		if (!window) throw new Error('[ClientDB] Cannot initialize serverside')

		this.initialized = false

		this.userStore = null

		this.feedsStore = null
		this.formsStore = null
		this.checklistsStore = null
		
		this.contentStore = null

		this.storeMap = {
			'user': this.userStore,
			'feeds': this.feedsStore,
			'forms': this.formsStore,
			'checklists': this.checklistsStore,
			'content': this.contentStore,
		}
	}

	init() {
		if (this.initialized) return

		this.userStore = localforage.createInstance({name: 'user'})
		this.feedsStore = localforage.createInstance({name: 'feeds'})
		this.formsStore = localforage.createInstance({name: 'forms'})
		this.checklistsStore = localforage.createInstance({name: 'checklists'})
		this.contentStore = localforage.createInstance({name: 'content'})

		this.initialized = true
	}

	get({store, key}) {
		return this.storeMap[store].getItem(key)
	}

	set({store, key, value}) {
		return this.storeMap[store].setItem(key, value)
	}

	remove({store, key}) {
		return this.storeMap[store].removeItem(key)
	}

	clear({store}) {
		return this.storeMap[store].clear()
	}

	clearAll() {
		return new Promise((resolve, reject) => {
			try {
				const storeKeys = Object.keys(this.storeMap)

				for (let i=0; i < storeKeys.length; i++) {
					try {
						this.clear({store: storeKeys[i]})
					} catch (e) {
						console.error(`[ClientDB] clearAll() exception at store ${storeKeys[i]}: \n`, e)
						reject(e)
					}

					if (i === storeKeys.length - 1) {
						resolve()
					}
				}
			} catch (e) {
				console.error('[ClientDB] clearAll() exception: \n', e)
				reject(e)
			}
		})
	}
}

export default ClientDB()