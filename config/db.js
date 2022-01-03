const mongoose = require('mongoose')

const connectDB = async (mongoURI) => {
	try {
		await mongoose.connect(mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})

		console.log(`MongoDB connected as ${mongoURI}`)
	} catch (err) {
		console.error(err.message)
		// Exit process with failure
		process.exit(1)
	}
}

module.exports = connectDB
