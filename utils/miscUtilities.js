/* Check if string is valid UUID */
function checkIfValidUUID(str) {
	// regular expression to check if string is a valid UUID
	const regexExp =
		/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi

	return regexExp.test(str)
}

/* Check if string is a valid ObjectID */
function checkIfValidMongoObjectID(str) {
	// regular expression to check if string is a valid MongoDB ObjectID
	const regexExp = /^[0-9a-fA-F]{24}$/

	return regexExp.test(str)
}

module.exports = { checkIfValidUUID, checkIfValidMongoObjectID }
