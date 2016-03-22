var q = require("q");

module.exports = function(mongoose)
{
    var UserSchema = new mongoose.Schema(
        {
            username    :  {type:String,required:true},
            password    :  {type:String,required:true,bcrypt: true},
            email       :  {type:String,required:true},
            firstName   :  {type:String,required:true},
            lastName    :  {type:String,required:true},
            dateCreated :  {type:Date,default : new Date()},
            roles       :  {type:[String],default:['registered']}
        }, {collection: "user"});
    UserSchema.methods.validPassword = function( pwd ) {
        // returns true or false!
        return ( this.password === pwd );
    };
    UserSchema.methods.isAdmin = function() {
        // returns true or false!
        return (this.roles.indexOf('admin') > -1 );
    };
    // mongoose-bcrypt
    //Adds encrypted password field with instance methods verifyPassword(password,callback)
    // and verifyPasswordSync(password) and static method encryptPassword(password,callback)

    UserSchema.plugin(require('mongoose-bcrypt'));




    var UserModel = mongoose.model("user", UserSchema);

    var api = {
        model:UserModel,
        getAllUsers : getAllUsers,
        getUserById : getUserById,
        usernameExists : usernameExists
    };

    return api;

    function usernameExists(username,callback){

        UserModel.findOne({ username: username }, function (err, user) {
            console.log('found this user: '+user);
            if (err) {
                //callback(err);
                console.log("MongoDB Error: " + err);
            }

            if(user){
                callback(true);
            }else{
                callback(false);
            }
        });
    }

    function getAllUsers(){
        var deferred = q.defer();
        var query = UserModel.find({});
        query.exec(function(err,data){
            if (err) {
                deferred.reject(err);
            }else{
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    }

    function getUserById(uid){
        var deferred = q.defer();
        UserModel.findOne({_id: uid})
                .then(function(user){
                    console.log('user:'+user);
                    deferred.resolve(user);
                },function(){
                    console.log('error:cant find user');
                    deferred.reject('cant find user');
                });
        return deferred.promise;
    }






}