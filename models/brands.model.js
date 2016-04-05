var q = require("q");

module.exports = function(mongoose, db){
    var brandSchema = new mongoose.Schema(
        {

            vehicletype : String,
            id : String,
            name : String,

        },{colletion: 'brands'}
    );
    //static method for getting brandslist with models nested
    brandSchema.statics.getAllBrandsWithModels = function(vehicletypesToInclude,brandsToExclude,callback){
        //setting default values to arguments
        vehicletypesToInclude = typeof vehicletypesToInclude !== 'undefined' ? vehicletypesToInclude : [];
        brandsToExclude = typeof brandsToExclude !== 'undefined' ? brandsToExclude : [];

        this.model('Brand').aggregate([
            { $match : {vehicletype:{$in:vehicletypesToInclude},id:{$nin:brandsToExclude}}},
            {$project : {id:'$id',name: '$name',_id:0}}
        ])
        .exec(callback);
    };

    var BrandModel = mongoose.model('Brand', brandSchema);
    var api = {
        model : BrandModel,
        getAllBrands : getAllBrands,
        getAllBrandsWithModels : getAllBrandsWithModels,
        getModelsByBrandId : getModelsByBrandId



    };
    return api;

    function getAllBrands(vehicletypesToInclude,brandsToExclude){
        //setting default values to arguments
        vehicletypesToInclude = typeof vehicletypesToInclude !== 'undefined' ? vehicletypesToInclude : [];
        brandsToExclude = typeof brandsToExclude !== 'undefined' ? brandsToExclude : [];
        var deferred = q.defer();
        var query = BrandModel.aggregate([
            { $match : {vehicletype:{$in:vehicletypesToInclude},id:{$nin:brandsToExclude}}},
            {$project : {id:'$id',name: '$name',_id:0}}
        ]);
        query.exec(function(err,data){
            if (err) {
                deferred.reject(err);
            }else{
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    }

    function getAllBrandsWithModels(vehicletypesToInclude,brandsToExclude){
        //setting default values to arguments
        vehicletypesToInclude = typeof vehicletypesToInclude !== 'undefined' ? vehicletypesToInclude : [];
        brandsToExclude = typeof brandsToExclude !== 'undefined' ? brandsToExclude : [];
        var deferred = q.defer();
        var query = BrandModel.aggregate([
            { $match : {vehicletype:{$in:vehicletypesToInclude},id:{$nin:brandsToExclude}}},
            {$project : {models:'$models',id:'$id',name: '$name',_id:0}}
        ]);
        query.exec(function(err,data){
            if (err) {
                deferred.reject(err);
            }else{
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    }

    function getModelsByBrandId(brandid){

        var deferred = q.defer();
        var query = BrandModel.aggregate([
            { $match : { id: brandid }},
            {$unwind:'$models'},
            {$project : {id:'$models.id',name: '$models.name',_id:0}}
        ]);
        query.exec(function(err,data){
            if (err) {
                deferred.reject(err);
            }else{
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    }




};