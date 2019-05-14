import 'isomorphic-unfetch'
import Crypto from '../utils/crypto'

class Account {
	window() {
		if (typeof window === 'undefined') {
			throw new Error('[Account] Cannot run account serverside')
			return false
		}

		return true
	}

	async login(password, cb) {
		if (!this.window()) return false

		const res = await fetch(`${process.env.ROOT}/api/auth/key`)
		const key = await res.text()
		const crypto = new Crypto(key)

		window.sessionStorage.setItem('um_p', crypto.encrypt(password))

		!!cb && cb()
	}

	logout() {
		if (!this.window()) return false

		if (!this.isLoggedIn()) {
			alert('You are already logged out.')
			return false
		}

		window.sessionStorage.removeItem('um_p')
		window.location.reload()
	}

	async password() {
		if (!this.window() || !this.isLoggedIn()) return false

		const res = await fetch(`${process.env.ROOT}/api/auth/key`)
		const key = await res.text()
		const crypto = new Crypto(key)

		return crypto.decrypt(window.sessionStorage.getItem('um_p'))
	}

	isLoggedIn() {
		if (!this.window()) return false
		return !!window.sessionStorage.getItem('um_p')
	}
}

export default new Account()