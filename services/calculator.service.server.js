module.exports = function(server, CalculatorModel,UserModel, passport , mongoose)
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
    server.post("/api/:userid/calculator", function(req, res)
    {
        if(req.isAuthenticated()) {
            isUserAdmin(req.user.username, function (user) {
                if(user == 0)
                {
                    if(req.user._id != req.params.userid ){
                        console.log(req.user._id);
                        console.log(req.params.userid);
                        res.json({success:false,message:'Not administrator!'});
                        return;
                    }

                }
                var newcalc = req.body;

              CalculatorModel.create(newcalc, function (err, result) {
                  if(err){
                      res.json({success:false,message:'Error! - Calculator not created!'});
                      return;
                  }else{
                      res.json({success:true,item:result});
                  }
                });
            });
        }
        else
        {
          res.json({success:false,message:'Not logged in!'});
        }
    });

    //copy a calculator
    //duplicate a single calculator by id- only admin or calculator owner
    server.get("/api/:userid/calculator/:id/duplicate", function(req, res)
    {
        if(req.isAuthenticated()) {
            isUserAdmin(req.user.username, function (user) {
                if (user != '0' || req.user._id == req.params.userid) {
                    CalculatorModel.findById(req.params.id, function (err, calculator) {
                        if(err){
                            res.json({success:false,message:'Error! - Calculator to duplicate not found!'});
                            return;
                        }else {
                            //found the source calculator
                            //creating a target calculator
                            var copyCalc = new CalculatorModel(calculator);
                            //updating _id and createDate
                            copyCalc._id = mongoose.Types.ObjectId();
                            copyCalc.dateCreated = new Date();
                            //adding copytext to title
                            copyCalc.title = copyCalc.title+'(copy)';
                            //save our copy
                            copyCalc.save(function (err, result) {
                                if(err)
                                {
                                    res.json({success:false,message:'Error! - Calculator not duplicated!'});
                                    return;
                                }
                                else
                                {
                                    res.json({success:true,item:result});
                                }
                            }
                                );

                            //res.json({success: true, item: calculator});
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
                    CalculatorModel.find({user_id:req.params.userid},'title description dateCreated', function (err, calculators) {
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
                if (adminuser != '0' || ((req.user._id == req.params.userid) && (req.user._id == req.body.user_id)) ) {
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

    //get a price based on model ID
    server.get("/api/calculator/:calcid/offer/:modelid", function(req, res)
    {
        var calcid = req.params.calcid;
        var modelid = req.params.modelid;

        var query = CalculatorModel.aggregate(
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
                { $match: {'brands.models.id':modelid } },
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
        );
            query.exec(function(err,offer){
                if (err) {
                    res.json({success: false, message: 'Error! something went wrong!'});;
                }else{
                    // if we have an offer on this model return success and price
                    if(offer.length > 0){
                        res.json({success:true,offer:offer[0].price});
                    }
                    //else return success false
                    else{
                        res.json({success: false, message: 'No offer on this model'});
                    }
                    //res.json({success:true,offer:offer});
                }
            });

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