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
		User.findOne({ username: username }, function (err, user) {
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
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

//helper function for checking if user is loggedind
function isloggedin(req, res, next){
	if(req.isAuthenticated()){
		next();
	}else{
		res.send(401);
	}
}

function ensureAdmin(req, res, next) {
	if (req.isAuthenticated()) {
		User
			.findById(req.user._id)
			.then(function(user){
				delete user.password;
				if(user.roles.indexOf("admin") > -1) {
					return next();
				} else {
					res.send(401);
					//res.redirect('/#/login');
				}
			})
	}
}



//var UserSchema = new mongoose.Schema(
//	{
//		username:  String,
//		password:  String,
//		email:     String,
//		firstName: String,
//		lastName:  String,
//		roles:     [String]
//	}, {collection: "user"});
//UserSchema.methods.validPassword = function( pwd ) {
//	// returns true or false!
//	return ( this.password === pwd );
//};
var User = require("./models/user.model.js")(mongoose, db);
var Brand = require("./models/brands.model.js")(mongoose, db);
var Vehicle = require("./models/vehicle.model.js")(mongoose, db);
//var User = mongoose.model("User", UserSchema);
//UserModel.create({
//	username:"claus",
//	password:"ettepige",
//	email:"claus@multimedion.dk",
//	firstName: "Claus",
//	lastName: "Hansen",
//	roles:["admin","author"]
//},function(err,res){
//	console.log(err);
//	console.log(res);
//}
//);
//UserModel.create({
//		username:"henriette",
//		password:"casNat",
//		email:"henriette@multimedion.dk",
//		firstName: "Henriette",
//		lastName: "Jacobsen",
//		roles:["author"]
//	},function(err,res){
//		console.log(err);
//		console.log(res);
//	}
//);
//UserModel.findOne({username:"claus"},function(err,user){
//	console.log(err);
//	console.log(user);
//})

//var db = mongoose.connect('mongodb://localhost/motorregister');
//defining schemas
//var vehicleSchema = new mongoose.Schema(
//{
//	_id : String,
//    Licensplate : String ,
//    Regstatus : String,
//    ModelYear : Number,
//    VehicleType : String,
//    BrandId : String,
//    Brand : String,
//    ModelId : String,
//    Model : String,
//    VariantId : String,
//    Variant : String,
//    Engine : Number
//},{colletion: 'vehicles'}
//);

//var brandSchema = new mongoose.Schema(
//{
//	_id : String,
//    VehicleType : String,
//    BrandId : String,
//    Brand : String,
//
//},{colletion: 'brands'}
//);

//var brandSchema = new mongoose.Schema(
//	{
//
//		vehicletype : String,
//		id : String,
//		name : String,
//
//	},{colletion: 'brands'}
//);


//var brandandmodelSchema = new mongoose.Schema(
//	{
//
//		VehicleType : String,
//		id : String,
//		name : String,
//
//	},{colletion: 'brandsandmodels'}
//);
//Define models
//var VehicleModel = mongoose.model('Vehicle', vehicleSchema);
//var BrandModel = mongoose.model('Brand', brandSchema);
//var Brandnmodels = mongoose.model('Brandsannmodels', brandandmodelSchema);
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

//vehicle by licensplate
//server.get('/api/vehicle/licensplate/:licensplate',
//	//isloggedin,
//	//ensureAdmin,
//	function(req,res){
//	var plate = req.params.licensplate;
//	var query = VehicleModel.findOne({Licensplate:plate});
//	query.exec(function(err,data){
//		if (err) {
//			res.json(err);
//		}else{
//			res.json(data);
//		}
//	});
//});

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
//server.get('/api/vehicle/brands', function(req,res){
//	BrandModel.find(function(err,data){
//		if (err) {
//			res.json(err);
//		}else{
//			res.json(data);
//		}
//	});
//});


//brands
//server.get('/api/vehicle/brands', function(req,res){
//	var query = BrandModel.aggregate([
//		{ $match : {vehicletype:{$in:vehicletypesToInclude},id:{$nin:brandsToExclude}}},
//		{$project : {id:'$id',name: '$name',_id:0}}
//	]);
//	query.exec(function(err,data){
//		if (err) {
//			res.json(err);
//		}else{
//			res.json(data);
//		}
//	});
//});
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
server.get('/api/vehicle/models/:brandid', function(req,res){
	var brandid = req.params.brandid;
	var query = BrandModel.aggregate([
		{ $match : { id: brandid ,vehicletype:{$in:vehicletypesToInclude}}},
		{$unwind:'$models'},
		{$project : {id:'$models.id',name: '$models.name',_id:0}}
	]);
	query.exec(function(err,data){
		if (err) {
			res.json(err);
		}else{
			res.json(data);
		}
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
//server.get('/api/vehicle/models/:brandid', function(req,res){
//	var brandid = req.params.brandid;
//	var query = VehicleModel.aggregate([
//    { $match : { BrandId: brandid ,VehicleType:{$in:vehicletypesToInclude}}},
//    { $group : {_id : {ModelId:'$ModelId',Model:"$Model"} } },
//    { $sort : {'_id.Model' : 1} },
//    {$project : {id:'$_id.ModelId',name: '$_id.Model',_id:0}}
//    ]);
//	query.exec(function(err,data){
//		if (err) {
//			res.json(err);
//		}else{
//			res.json(data);
//		}
//	});
//});

//Admintasks
//TODO - protect
//server.get('/admin/createcollection/brands', function(req,res){
//
//	var query = VehicleModel.aggregate([
//    { $group : {_id : {BrandId:'$BrandId',Brand:"$Brand",VehicleType:'$VehicleType'} } },
//    { $sort : {'_id.Brand' : 1} },
//    {$project : {BrandId:'$_id.BrandId',Brand:'$_id.Brand',VehicleType:'$_id.VehicleType',_id:0}},
//    { $out: "brands" }
//    ]);
//	query.exec(function(err,data){
//		if (err) {
//			res.json(err);
//		}else{
//			res.json({created:'collection',name:'brands'});
//		}
//	});
//});

server.get('/admin/createcollection/brands', function(req,res){

	var query = Vehicle.aggregate([
		{$group:{_id:{ name: '$Brand', id: '$BrandId',vehicletype:'$VehicleType' },
				models: { $addToSet: {id:'$ModelId',name:'$Model'} }
			},
		},{$project:{_id:0,models: '$models',id:'$_id.id',name: '$_id.name',vehicletype: '$_id.vehicletype'	}},
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



