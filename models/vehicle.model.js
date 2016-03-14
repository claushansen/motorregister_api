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
        getVehicleByLicensplate : getVehicleByLicensplate,
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

}
