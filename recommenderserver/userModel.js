var mongoose = require("mongoose");
// Setup schema
var userSchema = mongoose.Schema({
	_id: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	pin: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	dateCreated: {
		type: Date,
		default: Date.now,
	},
});
// Export user model
var User = (module.exports = mongoose.model("user", userSchema));
module.exports.get = function (callback, limit) {
	User.find(callback).limit(limit);
};
