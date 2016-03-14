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
			if (!user.validPassword(password)) {
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

//getting models
var User = require("./models/user.model.js")(mongoose, db);
var Brand = require("./models/brands.model.js")(mongoose, db);
var Vehicle = require("./models/vehicle.model.js")(mongoose, db);


//set up static
server.use(express.static(__dirname + '/public'));

 
//Setting filters here- TODO make settings collection for individuel settings
var vehicletypesToInclude = ['Personbil'];
var brandsToExclude = ["15459","19999","0"];
//var ModelsToInclude = ['Personbil']

server.post('/login',
	passport.authenticate('local'),
	function(req, res) {
		// If this function gets called, authentication was successful.
		// `req.user` contains the authenticated user.
		console.log(req.user);
		//console.log(req.body);
		res.send('loggedin yahoo as'+req.user);
		//res.redirect('/users/' + req.user.username);
	});
server.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

server.get('/api', function(req,res){
res.json({apiname:'Motorregister API'})

});

server.get('/api/vehicles', function(req,res){
	var query = VehicleModel.find().limit(10);
	query.exec(function(err,data){
		if (err) {
			res.json(err);
		}else{
		res.json(data);
		}
	});
});

server.get('/api/vehicle/licensplate/:licensplate',
    //isloggedin,
    ensureAdmin,
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
//TODO - protect

server.get('/admin/createcollection/brands', function(req,res){

	var query = Vehicle.aggregate([
		{$group:{_id:{ name: '$Brand', id: '$BrandId',vehicletype:'$VehicleType' },
				models: { $addToSet: {id:'$ModelId',name:'$Model'} }
			},
		},
        {$project:{_id:0,models: '$models',id:'$_id.id',name: '$_id.name',vehicletype: '$_id.vehicletype'	}},
		//unpacking models array
		{$unwind: "$models"},
		//Sorting models
		{$sort:	{'models.name':1}},
		//matching all with no empty values, removing unwanted records
		{$match:{'models.name':{$ne:'-'}}},
		{$match:{'models.name':{$ne:'UOPLYST'}}},
		//grouping everything together again
		{$group:{_id:{_id:"$_id",name:'$name',id:'$id',vehicletype:'$vehicletype'},models:{$push:"$models"}}},
		{$project:{_id:0,id:'$_id.id',name:'$_id.name',vehicletype:'$_id.vehicletype',models:'$models'}},
		//sorting by type and name on brand
		{$sort :{'vehicletype':1,'name': 1}},
		//matching all with no empty values, removing unwanted records
		{$match:{name:{$ne:'-'},id:{$ne:'0'}}}
		//outputting to new collection
		,{$out:'brands'}
	]);
	query.exec(function(err,data){
		if (err) {
			res.json(err);
		}else{
			res.json({created:'collection',name:'brands'});
		}
	});
});




 
server.listen(3000)



