var usermodel =
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



    var CalculatorModel = mongoose.model("Calculator", CalculatorSchema);
    return CalculatorModel;

}
