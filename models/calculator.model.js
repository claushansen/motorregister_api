
module.exports = function(mongoose,db) {

    var CalculatorSchema = new mongoose.Schema(
        {
            title: {type: String, required: true},
            description: {type: String},
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'},
            prisgrupper: {type: [mongoose.Schema.Types.Mixed], required: true},
            brands: {type: [mongoose.Schema.Types.Mixed], required: true},
            dateCreated: {type: Date, default: new Date()}
        }, {collection: "calculators"});

    //static method for getting priceoffer from model ID
    CalculatorSchema.statics.getOfferByModel = function(calcid,modelId, callback){

        this.model('Calculator').aggregate(
            [
                //matching calcid
                { $match : {_id:mongoose.Types.ObjectId(calcid)}},
                //only projecting the fields we need
                { $project: {_id:0, brands: '$brands', prisgrupper: '$prisgrupper'} },
                //unwinding brands
                { $unwind: "$brands" },
                //unwinding models
                { $unwind: "$brands.models" },
                //finding the model we need
                { $match: {'brands.models.id':modelId } },
                //only projecting the fields we need
                { $project: {prisgruppeId: '$brands.models.prisgruppeId', prisgrupper: '$prisgrupper' } },
                //unwinding prisgrupper
                { $unwind: "$prisgrupper" },
                // the tricky part -
                // using $let to define variables so we can create the foundmatch field
                // to see that we have the right field
                { $project: { prisgruppeId: '$prisgruppeId', prisgrupper: '$prisgrupper',
                    foundmatch: {
                        $let: {
                            vars: {prisgruppeId: '$prisgruppeId',prisgruppe: '$prisgrupper.id'},
                            in: {$eq:['$$prisgruppe','$$prisgruppeId']  }
                        }
                    }
                }
                },
                // matching our new field: foundmatch
                { $match: { foundmatch:true } },
                // projecting price only
                { $project: { price: '$prisgrupper.pris' } }
            ]
        )
        .exec(callback);
    };

    /*************************************
     * Function for mongo 2.4 on openshift
     ************************************/
    //static method for getting priceoffer from model ID
    CalculatorSchema.statics.getOfferByModel24 = function(calcid,modelId, callback){

        this.model('Calculator').aggregate(
            [
                //matching calcid
                { $match : {_id:mongoose.Types.ObjectId(calcid)}},
                //only projecting the fields we need
                { $project: {_id:0, brands: '$brands', prisgrupper: '$prisgrupper'} },
                //unwinding brands
                { $unwind: "$brands" },
                //unwinding models
                { $unwind: "$brands.models" },
                //finding the model we need
                { $match: {'brands.models.id':modelId } },
                //only projecting the fields we need
                { $project: {prisgruppeId: '$brands.models.prisgruppeId', prisgrupper: '$prisgrupper' } },
                //unwinding prisgrupper
                { $unwind: "$prisgrupper" }
            ]
            )
            .exec(function(err,data) {
                if(err){
                    callback(err,null);
                }else{
                    //we need to run over each pricegroup to get the one that match with the prisguppeId
                    var pricearr = [];
                    data.forEach(function(item, index){
                        if(item.prisgruppeId == item.prisgrupper.id){
                            //if we find the right one we push it to array
                            pricearr.push ({price:item.prisgrupper.pris});
                        }
                    });

                    callback(null,pricearr);
                    }

            //callback
            });
    };

    //static method for getting priceoffer from model ID
    CalculatorSchema.statics.getBrandsList = function(calcid, callback){

        this.model('Calculator').aggregate(
            [
                //matching calcid
                { $match : {_id:mongoose.Types.ObjectId(calcid)}},
                // only getting brands
                { $project: {_id:0, brands: '$brands' } },
                //Unwinding brands
                { $unwind: "$brands" },
                //only projecting id and name
                { $project: {id:'$brands.id', name:'$brands.name' } }
            ]
            )
            .exec(callback);
    }

    //static method for getting priceoffer from model ID
    CalculatorSchema.statics.getModelsList = function(calcid,brandid, callback){

        this.model('Calculator').aggregate(
            [
                //matching calcid
                { $match : {_id:mongoose.Types.ObjectId(calcid)}},
                // only getting brands
                { $project: {_id:0, brands: '$brands' } },
                //Unwinding brands
                { $unwind: "$brands" },
                //matching brandid
                { $match: { 'brands.id':brandid } },
                //Unwinding models
                { $unwind: "$brands.models" },
                //only projecting id and name
                { $project: { id: '$brands.models.id', name: '$brands.models.name' } }
            ]
            )
            .exec(callback);
    };

    var CalculatorModel = mongoose.model("Calculator", CalculatorSchema);
    return CalculatorModel;

};
