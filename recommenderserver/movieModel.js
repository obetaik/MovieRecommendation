var mongoose = require("mongoose");
// Setup schema
var movieSchema = mongoose.Schema({
	_id: {
		type: Number,
		required: true,
	},
	title: String,
	maritalStatus: String,
	addressLine1: String,
	addressLine2: String,
	dateCreated: {
		type: Date,
		default: Date.now,
	},
});
// Export Movie model
var movie = (module.exports = mongoose.model("movie", movieSchema));
module.exports.get = function (callback, limit) {
	Movie.find(callback).limit(limit);
};
