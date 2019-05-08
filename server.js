// Environment variable config see README.env for example
require('dotenv').config()
// Server setup
const cluster = require('cluster')
const debug = require('debug')('umbrella:server')
const http = require('http')
const numCPUs = require('os').cpus().length
const port = process.env.PORT || '3000'
const { parse } = require('url')
const { join, resolve } = require('path')

global.appRoot = resolve(__dirname)

// Background job setup
const cron = require('./server/cron')

// Express/Next setup
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const next = require('next')
const dev = process.env.NODE_ENV === 'development'
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare().then(() => {
	const server = express()
	
	// security
	server.disable('x-powered-by')

	// Server routes
	const api = require('./server/api')

	// Pages
	const index = require('./server/routes/index')
	const login = require('./server/routes/login')
	const account = require('./server/routes/account')
	const feeds = require('./server/routes/feeds')
	const forms = require('./server/routes/forms')
	const checklists = require('./server/routes/checklists')
	const lessons = require('./server/routes/lessons')

	// Server auth - if you want to password protect a staging site here's a nice easy way to do it
	if (process.env.BASIC_AUTH_ENABLED === 'true') {
		const basicAuth = require('express-basic-auth')
		let users = {}
		users[process.env.BASIC_AUTH_USERNAME] = process.env.BASIC_AUTH_PASSWORD

		server.use(basicAuth({
			users,
			challenge: true,
			realm: 'Imb4T3st4pp'
		}))
	}

	// Logs
	server.use(logger('dev'))

	// Configs
	server.use(bodyParser.urlencoded({ extended: false }))
	server.use(bodyParser.json())

	// Server routes
	server.use('/api', api)

	// Pages
	server.get('/', index.index(app))
	server.get('/login', login.index(app))
	server.get('/account', account.index(app))
	server.get('/feeds', feeds.index(app))
	server.get('/forms', forms.index(app))
	server.get('/forms/:sha', forms.new(app))
	server.get('/forms/:sha/:id', forms.edit(app))
	server.get('/checklists', checklists.index(app))
	server.get('/lessons', lessons.index(app))
	server.get('/lessons/favorites', lessons.favorites(app))
	server.get('/lessons/glossary', lessons.glossary(app))
	server.get('/lessons/:category', lessons.category(app))
	server.get('/lessons/:category/:level', lessons.level(app))
	server.get('/lessons/:category/:level/:sha', lessons.card(app))
	
	// Next.js routes that don't require backend routes
	server.get('*', (req, res) => {
		// setup static files from root like sitemap.xml || robots.txt || favicon.ico
		const parsedUrl = parse(req.url, true)
		const { pathname } = parsedUrl

		const rootStaticFiles = [
			'/robots.txt',
			'/sitemap.xml', 
			'/favicon.ico',
		]

		if (rootStaticFiles.indexOf(pathname) > -1) {
			const path = join(__dirname, 'static', pathname)
			return app.serveStatic(req, res, path)
		}

		if (pathname === '/sw.js') {
			const path = join(__dirname, '.next', pathname)
			return app.serveStatic(req, res, path)
		}

		// else serve page if not required by server
		handle(req, res)
	})

	if (dev) {
		// Init cron
		cron.start()

		// If in development don't use cluster api since this causes webpack hot reload to behave erratically
		server.listen(port, (err) => {
			if (err) throw err
			console.log('> Development server ready on ' + process.env.ROOT)
		})
	} else {
		// Cluster api for production only
		server.set('port', port)

		// Setup workers for concurrency
		if (cluster.isMaster) {
			// Fork workers.
			for (let i = 0; i < numCPUs; i++) {
				cluster.fork()

				if (i === 0) cron.start()
			}
		
			// If a worker dies, log it to the console and start another worker.
			cluster.on('exit', (worker, code, signal) => {
				console.log('Worker ' + worker.process.pid + ' died.')
				cron.stop()
				cron.start()
				cluster.fork()
			})
		
			// Log when a worker starts listening
			cluster.on('listening', (worker, address) => {
				console.log('Worker started with PID ' + worker.process.pid + '.')
			})
		} 
		else {
			// Create HTTP server.
			let ns = http.createServer(server)

			// Listen on provided port, on all network interfaces.    
			ns.listen(port)
		
			ns.on('error', (error) => {
				if (error.syscall !== 'listen') {
					throw error
				}
		
				const bind = typeof port === 'string'
					? 'Pipe ' + port
					: 'Port ' + port
		
				// Handle specific listen errors with friendly messages
				switch (error.code) {
					case 'EACCES':
						console.error(bind + ' requires elevated privileges')
						process.exit(1)
						break
					case 'EADDRINUSE':
						console.error(bind + ' is already in use')
						process.exit(1)
						break
					default:
						throw error
				}
			})
		
			ns.on('listening', () => {
				const addr = ns.address()
				const bind = typeof addr === 'string'
					? 'pipe ' + addr
					: 'port ' + addr.port
				debug('Listening on ' + bind)
			})
		}
	}

})
.catch((ex) => {
	console.error(ex.stack)
	process.exit(1)
})

