module.exports = function(server, BrandModel, mongoose)
{

    //get all brands by vehicletype only logged ind
    server.get("/api/brand/:vehicletype", function(req, res)
    {
        if(req.isAuthenticated()) {
            var query = BrandModel.aggregate([
                { $match : {vehicletype:{$eq:req.params.vehicletype}}},
                {$project : {id:'$id',name: '$name',_id:0}}
            ]);
            query.exec(function(err,brands){
                if (err) {
                    res.json({success: false, message: 'Error! something went wrong!'});;
                }else{
                    res.json({success:true,items:brands});
                }
            });
        }
        else
        {
            res.json({success: false, message: 'Not logged in!'});
        }
    });

    function isUserAdmin(username, callback)
    {
        UserModel.findOne({username: username}, function(err, foundUser)
        {
            if(foundUser.roles.indexOf('admin') > -1)
            {
                callback(foundUser);
            }
            else
            {
                callback('0');
            }
        });
    }

}