module.exports = function(mongoose)
{
    var UserSchema = new mongoose.Schema(
        {
            username:  String,
            password:  String,
            email:     String,
            firstName: String,
            lastName:  String,
            roles:     [String]
        }, {collection: "user"});
    UserSchema.methods.validPassword = function( pwd ) {
        // returns true or false!
        return ( this.password === pwd );
    };

    var UserModel = mongoose.model("user", UserSchema);

    return UserModel;
}