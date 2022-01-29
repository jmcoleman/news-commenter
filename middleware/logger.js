const chalk = require('chalk')

// helper function to calc time it takes to complete the request
const getActualRequestDurationInMilliseconds = (start) => {
	const NS_PER_SEC = 1e9 // convert to nanoseconds
	const NS_TO_MS = 1e6 // convert to milliseconds
	const diff = process.hrtime(start)
	return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

// logger
const cliLogger = (req, res, next) => {
	let formatted_date = new Date()
		.toLocaleString('UTC', {
			timeZone: 'UTC',
			timeZoneName: 'short',
			hour12: false,
		})
		.replace(',', '')

	let options = {
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // timezone javascript
		timeZoneName: 'short',
		// weekday: 'long',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: 'numeric',
		second: 'numeric',
		hour12: true,
	}
	let localized_date = new Date()
		.toLocaleString('en-US', options)
		.replace(',', '')

	let method = req.method
	let url = req.url
	let status = res.statusCode

	const start = process.hrtime()
	const durationInMilliseconds = getActualRequestDurationInMilliseconds(start)
	let log = `[${formatted_date}] ${chalk.cyan(method)}:${chalk.greenBright(
		url
	)} ${chalk.cyan(
		status
	)} ${durationInMilliseconds.toLocaleString()} ms [${chalk.blue(
		localized_date
	)}]`
	console.log(log)
	next()
}

module.exports = cliLogger
