var express = require('express')
var app = express()
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/motorregister');
//defining schemas
var vehicleSchema = new mongoose.Schema(
{
	_id : String,
    Licensplate : String ,
    Regstatus : String,
    ModelYear : Number,
    VehicleType : String,
    BrandId : String,
    Brand : String,
    ModelId : String,
    Model : String,
    VariantId : String,
    Variant : String,
    Engine : Number,
	models : Array
},{colletion: 'vehicles'}
); 

var brandSchema = new mongoose.Schema(
{
	_id : String,
    VehicleType : String,
    BrandId : String,
    Brand : String,
    
},{colletion: 'brands'}
); 
//Define models
var VehicleModel = mongoose.model('Vehicle', vehicleSchema);
var BrandModel = mongoose.model('Brand', brandSchema);
//set up static
app.use(express.static(__dirname + '/public'));
 
//Setting filters here- TODO make settings collection for individuel settings
var vehicletypesToInclude = ['Personbil'];
var brandsToExclude = ["15459","19999","0"];

app.get('/api', function(req,res){
res.json({apiname:'Motorregister API'})

});

app.get('/api/vehicles', function(req,res){
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
app.get('/api/vehicle/licensplate/:licensplate', function(req,res){
	var plate = req.params.licensplate;
	var query = VehicleModel.findOne({Licensplate:plate});
	query.exec(function(err,data){
		if (err) {
			res.json(err);
		}else{
			res.json(data);
		}
	});
});

//brands
app.get('/api/vehicle/brands', function(req,res){
	var query = BrandModel.aggregate([
    { $match : {VehicleType:{$in:vehicletypesToInclude},BrandId:{$nin:brandsToExclude}}},
    { $group : {_id : {BrandId:'$BrandId',Brand:"$Brand"} } },
    { $sort : {'_id.Brand' : 1} },
    {$project : {id:'$_id.BrandId',name: '$_id.Brand',_id:0}}
    ]);
	query.exec(function(err,data){
		if (err) {
			res.json(err);
		}else{
			res.json(data);
		}
	});
});
//models by brand id
app.get('/api/vehicle/models/:brandid', function(req,res){
	var brandid = req.params.brandid;
	var query = VehicleModel.aggregate([
    { $match : { BrandId: brandid ,VehicleType:{$in:vehicletypesToInclude}}},
    { $group : {_id : {ModelId:'$ModelId',Model:"$Model"} } },
    { $sort : {'_id.Model' : 1} },
    {$project : {id:'$_id.ModelId',name: '$_id.Model',_id:0}}
    ]);
	query.exec(function(err,data){
		if (err) {
			res.json(err);
		}else{
			res.json(data);
		}
	});
});

//Admintasks
//TODO - protect
app.get('/admin/createcollection/brands', function(req,res){
	
	var query = VehicleModel.aggregate([
    { $group : {_id : {BrandId:'$BrandId',Brand:"$Brand",VehicleType:'$VehicleType'} } },
    { $sort : {'_id.Brand' : 1} },
    {$project : {BrandId:'$_id.BrandId',Brand:'$_id.Brand',VehicleType:'$_id.VehicleType',_id:0}},
    { $out: "brands" }
    ]);
	query.exec(function(err,data){
		if (err) {
			res.json(err);
		}else{
			res.json({created:'collection',name:'brands'});
		}
	});
});




 
app.listen(3000)



