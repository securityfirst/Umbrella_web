import localforage from 'localforage'
import Crypto from '../utils/crypto'

class ClientDB {
	constructor() {
		if (typeof window === 'undefined') throw new Error('[ClientDB] Cannot initialize serverside')

		this.db = null
	}

	init() {
		return new Promise(async (resolve, reject) => {
			if (this.db) return resolve()

			try {
				this.db = localforage.createInstance({
					name: 'umbrella',
					storeName: 'store',
					description: 'Local data store',
				})

				const isProtected = await this.db.getItem('protected')

				if (isProtected === null) {
					const hash = await this.db.getItem('h')
					this.db.setItem('protected', hash !== null)
				}

				const locale = await this.db.getItem('locale')

				if (locale === null) this.db.setItem('locale', 'en')

				return resolve()
			} catch (e) {
				console.error('[ClientDB] init() exception: \n', e)
				return reject(e)
			}
		})
	}

	get(key, encryptionKey, expectsObject = false) {
		return new Promise(async (resolve, reject) => {
			if (!this.db) await this.init()

			this.db
				.ready()
				.then(() => {
					this.db
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
			if (!this.db) await this.init()

			this.db
				.ready()
				.then(() => {
					if (encryptionKey) {
						const crypto = new Crypto(encryptionKey)
						value = crypto.encrypt(value)
					}

					this.db
						.setItem(key, value)
						.then(resolve)
						.catch(reject)
				})
				.catch(reject)
		})
	}

	remove(key) {
		return new Promise(async (resolve, reject) => {
			if (!this.db) await this.init()

			this.db
				.ready()
				.then(() => {
					this.db
						.removeItem(key)
						.then(resolve)
						.catch(reject)
				})
				.catch(reject)
		})
	}

	clear() {
		return this.db.clear()
	}
}

export default new ClientDB()