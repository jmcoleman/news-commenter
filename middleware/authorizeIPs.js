const dotenv = require('dotenv')
const chalk = require('chalk')

// middleware to check for valid ip for usage of api (e.g.)
const authorizeIPs = (req, res, next) => {
	const ALLOWED_IPS = process.env.ALLOWED_IPS || []

	// console.log('List: ' + ALLOWED_IPS)
	// console.log('req.ip: ' + req.ip)

	let ip = req.ip
	if (ip.substr(0, 7) == '::ffff:') {
		ip = ip.substr(7)
	} else if (ip.substr(0, 3) == '::1') {
		ip = 'localhost'
	}

	// if all ips are valid
	if (ALLOWED_IPS.indexOf('*') !== -1) {
		// console.log(chalk.dim.italic('Authorized via *'))
		return next()
	}

	// if ip is in list of valid
	let userIsAllowed = ALLOWED_IPS.indexOf(ip) !== -1
	if (userIsAllowed) {
		// console.log(chalk.dim.italic(`Authorized ip ${req.ip}`))
		return next()
	}

	// otherwise, invalid
	console.log(chalk.dim.italic('Unauthorized ip'))
	res.status(401).send('Not authorized!')

	//TODO send errorhandler info to error page with details
	// res.status(401).render('404', {
	// 	url: req.url,
	// 	statusCode: res.statusCode,
	// 	message: 'Not authorized!',
	// })
}

module.exports = authorizeIPs
