module.exports = function(server, CalculatorModel,UserModel, passport)
{
    //get all calculators only as Admin
    server.get("/api/calculator", function(req, res)
    {
        if(req.isAuthenticated()) {
            isUserAdmin(req.user.username, function (user) {
                if (user != '0') {
                    CalculatorModel.find(function (err, calculators) {
                        res.json({success:true,items:calculators});
                    });
                }
                else
                {
                    res.json({success: false, message: 'You dont have access to this resource!'});
                }
            });
        }
        else
        {
            res.json({success: false, message: 'Not logged in!'});
        }
    });

    //get single calculator by id- only admin or calculator owner
    server.get("/api/:userid/calculator/:id", function(req, res)
    {
        if(req.isAuthenticated()) {
            isUserAdmin(req.user.username, function (user) {
                if (user != '0' || req.user._id == req.params.userid) {
                    CalculatorModel.findById(req.params.id, function (err, calculator) {
                        res.json({success:true,item:calculator});
                    });
                }
                else {
                    res.json({success: false, message: 'You dont have access to this resource!'});
                }
            });
        }
        else
        {
            res.json({success: false, message: 'Not logged in!'});
        }
    });

    //create new calculator as admin or user
    server.post("/api/calculator", function(req, res)
    {
        if(req.isAuthenticated()) {
            isUserAdmin(req.user.username, function (user) {
                if(user == 0)
                {
                    if(req.user._id !== req.body.user_id ){
                        res.json({success:false,message:'Not administrator!'});
                        return;
                    }

                }
                var newcalc = req.body;

              CalculatorModel.create(newcalc, function (err, result) {
                    res.json({success:true,item:result});
                });
            });
        }
        else
        {
          res.json({success:false,message:'Not logged in!'});
        }
    });

    //delete single calculator by id- only admin or calculator owner
    server.delete("/api/:userid/calculator/:id", function(req, res)
    {
        if(req.isAuthenticated()) {
            isUserAdmin(req.user.username, function (user) {
                if (user != '0' || req.user._id == req.params.userid) {
                    CalculatorModel.remove({_id: req.params.id}, function (err, count) {
                        if(err)
                        {
                            res.json({success:false,message:'error! Something went wrong'})
                            return;
                        }
                        res.json({success:true,message:'Calculator removed'});
                    });

                }
                else {
                    res.json({success: false, message: 'You dont have access to this resource!'});
                }
            });
        }
        else
        {
            res.json({success: false, message: 'Not logged in!'});
        }
    });

    //get all calculators by userid- only admin or calculator owner
    server.get("/api/calculator/:userid", function(req, res)
    {
        if(req.isAuthenticated()) {
            isUserAdmin(req.user.username, function (user) {
                if (user != '0' || req.user._id == req.params.userid) {
                    CalculatorModel.find({user_id:req.params.userid}, function (err, calculators) {
                        res.json({success:true,items:calculators});
                    });
                }
                else {
                    res.json({success: false, message: 'You dont have access to this resource!'});
                }
            });
        }
        else
        {
            res.json({success: false, message: 'Not logged in!'});
        }
    });

    //updating calculator only by admin or calculator owner
    server.put('/api/:userid/calculator/:id', function(req, res)
    {
        if(req.isAuthenticated()) {
            isUserAdmin(req.user.username, function (adminuser) {
                if (adminuser != '0' || req.user._id == req.params.userid) {
                    var updatedCalc = req.body;
                    //getting the calculator to be updated
                    CalculatorModel.findById(req.params.id, function (err, foundCalculator) {
                        if (err) {
                            res.json({success:false,message:'no calculator to update!'});
                            return;
                        } else
                        {
                            foundCalculator.update(updatedCalc, function (err, count) {
                                if (err) {
                                    res.json({success: false, message: 'Calculator not updated!'});
                                    return;
                                }
                                res.json({success: true, message: 'Calculator updated!'});
                            });
                        }
                    });
                }
                else {
                    res.json({success: false, message: 'You dont have access to this resource!'});
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