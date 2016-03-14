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

    var api = {
        model:UserModel,
        makeExampleUsers:makeExampleUsers
    };

    return api;


    function makeExampleUsers() {
        var exampledata = [
            {
                username: "claus",
                password: "ettepige",
                email: "claus@multimedion.dk",
                firstName: "Claus",
                lastName: "Hansen",
                roles: ["admin", "author"]
            },
            {
                username: "claus",
                password: "ettepige",
                email: "claus@multimedion.dk",
                firstName: "Claus",
                lastName: "Hansen",
                roles: ["admin", "author"]
            }];

        forEach(exampledata, function (exampleuser) {
            UserModel.create(exampleuser, function (err, res) {
                    console.log(err);
                    console.log(res);
                }
            );
        });
    }

}