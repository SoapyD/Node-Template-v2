
exports.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
		
	switch(process.env.INSTANCE_TYPE){
		case "DEV":
		case "DEV-ONLINE":
			return next();
			break;
	}

	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login")
}