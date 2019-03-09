import localforage from 'localforage'
import Crypto from '../utils/crypto'

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

						return resolve()
					})
			} catch (e) {
				console.error('[ClientDB] init() exception: \n', e)
				return reject(e)
			}
		})
	}

	get(key, encryptionKey, expectsObject = false) {
		return new Promise(async (resolve, reject) => {
			if (!this.store) await this.init()

			this.store
				.ready()
				.then(() => {
					this.store
						.getItem(key)
						.then(data => {
							if (!data) return resolve()
							if (!encryptionKey) return resolve(data)

							const crypto = new Crypto(encryptionKey)
							const decrypted = crypto.decrypt(data, expectsObject)

							return resolve(decrypted)
						})
						.catch(reject)
				})
				.catch(reject)
		})
	}

	set(key, value, encryptionKey) {
		return new Promise(async (resolve, reject) => {
			if (!this.store) await this.init()

			this.store
				.ready()
				.then(() => {
					if (encryptionKey) {
						const crypto = new Crypto(encryptionKey)
						value = crypto.encrypt(value)
					}

					this.store
						.setItem(key, value)
						.then(resolve)
						.catch(reject)
				})
				.catch(reject)
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

export default new ClientDB()