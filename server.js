var express       = require('express');
var server        = express();
var bodyParser    = require('body-parser');
var multer        = require('multer');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var mongoose      = require('mongoose');

//mailsettings
var nodemailer = require("nodemailer");
var smtpConfig = {
	host: 'cp6.danhost.dk',
	port: 465,
	secure: true, // use SSL
	auth: {
		user: 'noreply@bilapi.dk',
		pass: '!MyGreenTub0rg'
	}
};
var myMailer = nodemailer.createTransport(smtpConfig);

//setting up connection variables :Openshift/local
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var connectString = process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME || 'mongodb://localhost/calculator';

//connecting to database
var db = mongoose.connect(connectString);

//server.use(bodyParser.json());
server.use(bodyParser.json({limit: '5mb'}));
server.use(bodyParser.urlencoded({ extended: true }));
//server.use(multer());
server.use(session({ secret: 'this is my secret cat' }));
server.use(cookieParser());
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

//set up static
server.use(express.static(__dirname + '/public'));

// Setting no-cache to ensure browser doesn't caches especially IE
server.use(function (req, res, next) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	next()
});


passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.model.findById(id, function(err, user) {
		user.password = '*******';
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

var UserService = require("./services/user.service.server.js")(server, User.model, passport, myMailer);
var BrandService = require("./services/brand.service.server.js")(server,  Brand.model, mongoose);
var CalculatorService = require("./services/calculator.service.server.js")(server, Calculator, User.model,Vehicle, passport, mongoose, myMailer);


 
//Setting filters here- TODO make settings collection for individuel settings
var vehicletypesToInclude = ['Personbil'];
var brandsToExclude = ["15459","19999","0"];
//var ModelsToInclude = ['Personbil']

//Routes


server.get('/api', function(req,res){

	var mailOptions={
		from:'noreply@bilapi.dk',
		to : 'multimedion@gmail.com',
		subject : 'test af bilapimail',
		text : 'Det lykkedes at sende til gmail fra bilapi.dk',
		html: '<h1>Tillykke</h1><p>Den gik igennem!</p>'
	};
	console.log(mailOptions);
	myMailer.sendMail(mailOptions, function(error, response){
		if(error){
			console.log(error);
			res.end("error");
		}else{
			console.log("Message sent: " + response);
			res.end("sent");
		}
	});



//res.json({apiname:'Motorregister API'})

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




server.listen(port, ipaddress);



