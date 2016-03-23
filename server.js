var express       = require('express');
var server        = express();
var bodyParser    = require('body-parser');
var multer        = require('multer');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var mongoose      = require('mongoose');
//var apiRoutes     = require("./routes/api.route.js")(express);
//server.use('/api',apiRoutes);
var db = mongoose.connect('mongodb://localhost/motorregister');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
//server.use(multer());
server.use(session({ secret: 'this is my secret cat' }));
server.use(cookieParser())
server.use(passport.initialize());
server.use(passport.session());

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.model.findOne({ username: username }, function (err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (!user.verifyPasswordSync(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}

			return done(null, user);
		});
	}
));

//allow-origin
//remove on production
server.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.model.findById(id, function(err, user) {
		done(err, user);
	});
});

//helper function for checking if user is loggedind
function isloggedin(req, res, next){
	if(req.isAuthenticated()){
		next();
	}else{
        res.sendStatus(401);
	}
}

function ensureAdmin(req, res, next) {
	if (req.isAuthenticated()) {
		User.model
			.findById(req.user._id)
			.then(function(user){
				//delete user.password;
				if(user.roles.indexOf('admin') > -1 ) {
					return next();
				} else {
                    res.sendStatus(401);
					//res.redirect('/#/login');
				}
			})
	}else{
        res.sendStatus(401);
    }
}

function isUserAdmin(username, callback)
{
    User.model.findOne({username: username}, function(err, foundUser)
    {
        if(foundUser.roles.indexOf('admin') > -1)
        {
            callback(foundUser);
        }
        else
        {
            callback('0');
        }
    });
}

//getting models
var User = require("./models/user.model.js")(mongoose, db);
var Brand = require("./models/brands.model.js")(mongoose, db);
var Vehicle = require("./models/vehicle.model.js")(mongoose, db);
var Calculator = require("./models/calculator.model.js")(mongoose, db);
//Calculator.find({})
//	.populate('user_id')
//
//	.exec(function(error, calcs) {
//		console.log(JSON.stringify(calcs, null, "\t"))
//	});
//testing models

var UserService = require("./services/user.service.server.js")(server, User.model, passport);
var CalculatorService = require("./services/calculator.service.server.js")(server, Calculator, User.model, passport, mongoose);

//set up static
server.use(express.static(__dirname + '/public'));

 
//Setting filters here- TODO make settings collection for individuel settings
var vehicletypesToInclude = ['Personbil'];
var brandsToExclude = ["15459","19999","0"];
//var ModelsToInclude = ['Personbil']

//Routes


server.get('/api', function(req,res){
res.json({apiname:'Motorregister API'})

});

server.get('/api/vehicle/licensplate/:licensplate',
    //isloggedin,
    //ensureAdmin,
    function(req,res){
        var plate = req.params.licensplate;
        Vehicle.getVehicleByLicensplate(plate)
            .then(
                function(data){
                    res.json(data);
                },function(err){
                    res.json(err);
                });
    });


//brands

server.get('/api/vehicle/brands', function(req,res){
	Brand.getAllBrands(vehicletypesToInclude)
		.then(
			function(data){
				res.json(data);
			},function(err){
				res.json(err);
			});


});

//models by brand id
server.get('/api/vehicle/models/:brandid', function(req,res){
    var brandid = req.params.brandid;
    Brand.getModelsByBrandId(brandid)
        .then(
            function(data){
                res.json(data);
            },function(err){
                res.json(err);
            });
});

//get models nested in brands
server.get('/api/vehicle/brands/nested', function(req,res){
    Brand.getAllBrandsWithModels(vehicletypesToInclude,brandsToExclude)
        .then(
            function(data){
                res.json(data);
            },function(err){
                res.json(err);
            });
});

//Admintasks
//Protected - Only users with the role of admin has access

server.get('/admin/api/createcollection/brands',ensureAdmin, function(req,res){
    Vehicle.createBrandCollection().then(
        function(data){
            res.json(data);
        },function(err){
            res.json(err);
        });
});



 
server.listen(3000)



