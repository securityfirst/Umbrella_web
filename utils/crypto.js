import CryptoJS from 'crypto-js'

class Crypto {
	constructor(secret) {
		if (secret === void 0) throw new Error('Crypto object MUST BE initialized with a SECRET KEY.')

		this._secret = secret;
		this._keySize = 256;
		this._iterations = 100;
	}

	static generateRandom(length = 128) {
		return CryptoJS.lib.WordArray.random(length / 8)
	}

	encrypt(data) {
		if (!data) throw new Error('No data was attached to be encrypted. Encryption halted.');

		const string = typeof data === 'object' ? JSON.stringify(data) : typeof data == 'string' || typeof data == 'number' || typeof data == 'boolean' ? data.toString() : null

		if (string === null) throw new Error('Only object, string, number and boolean data types that can be encrypted.')

		const salt = Crypto.generateRandom(128).toString()
		
		const key = CryptoJS.PBKDF2(this._secret, salt, {
			keySize: this._keySize / 32, 
			iterations: this._iterations
		})

		const initialVector = Crypto.generateRandom(128).toString()

		const encrypted = CryptoJS.AES.encrypt(string, key.toString(), {
			iv: initialVector,
			padding: CryptoJS.pad.Pkcs7,
			mode: CryptoJS.mode.CBC,
		}).toString()

		const ciphered = salt + initialVector + encrypted

		return ciphered;
	}

	decrypt(ciphered, expectsObject = false, enc = CryptoJS.enc.Utf8) {
		if (!ciphered) throw new Error('No encrypted string was attached to be decrypted. Decryption halted.');

		const salt = CryptoJS.enc.Hex.parse(ciphered.substring(0, 32)).toString()

		const initialVector = CryptoJS.enc.Hex.parse(ciphered.substring(32, 32)).toString()

		const encrypted = ciphered.substring(64)

		const key = CryptoJS.PBKDF2(this._secret, salt, {
			keySize: this._keySize / 32, 
			iterations: this._iterations
		}).toString()

		const decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
			iv: initialVector, 
			padding: CryptoJS.pad.Pkcs7,
			mode: CryptoJS.mode.CBC
		})

		const data = expectsObject ? JSON.parse(decrypted.toString(enc)) : decrypted.toString(enc)

		return data
	}
}

export default Crypto