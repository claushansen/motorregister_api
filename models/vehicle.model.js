var q = require("q");

module.exports = function(mongoose, db){
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
            Engine : Number
        },{colletion: 'vehicles'}
    );


//Define models
    var VehicleModel = mongoose.model('Vehicle', vehicleSchema);

    var api = {
        model : VehicleModel,
        getVehicleByLicensplate : getVehicleByLicensplate,
        createBrandCollection : createBrandCollection
    };

    return api;

    function getVehicleByLicensplate(plate){

        var deferred = q.defer();
        var query = VehicleModel.findOne({Licensplate:plate});
        query.exec(function(err,data){
            if (err) {
                deferred.reject(err);
            }else{
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    }

    function createBrandCollection(){

        var deferred = q.defer();
        var query = VehicleModel.aggregate([
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
                deferred.reject(err);
            }else{
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    }

}
