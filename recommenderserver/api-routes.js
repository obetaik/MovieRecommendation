// Initialize express router
let router = require("express").Router();

User = require("./userModel");
// Set default API response
router.get("/", function (req, res) {
	res.json({
		status: "API testing by tony",
		message: "Welcome to BCU Banking service!",
	});
});


// Import user controller
var userController = require("./userController");
// User routes
router.route("/user").get(userController.index).post(userController.new);
router.route("/user/:userId")
	//.get(userController.view)
	.post(userController.login)
	.put(userController.update);


// Import Movie controller
var movieController = require("./movieController");
// Movie routes
router
	.route("/movies")
	.get(movieController.index)
	.post(movieController.new);
router
	.route("/movies/:id")
	.post(movieController.viewByUserId)


// Export API routes
module.exports = router;
