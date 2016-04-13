var q = require("q");
module.exports = function(server, CalculatorModel,UserModel,Vehiclemodel, passport , mongoose, myMailer)
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
                            //needs to do it this way on openshift as we cant update on _id
                            targetCalc = {};
                            targetCalc.title = calculator.title+'(copy)';
                            targetCalc.description = calculator.description;
                            targetCalc.prisgrupper = calculator.prisgrupper;
                            targetCalc.brands = calculator.brands;
                            targetCalc.user_id = calculator.user_id;

                            var copyCalc = new CalculatorModel(targetCalc);

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
                            res.json({success:false,message:'error! Something went wrong'});
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
                    //removing _id from req.body as it creates an error on openshift
                    // as it uses mongo version 2.4 where you can't update on _id
                    delete req.body._id;
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


    /***********************************
    * Functions for frontend calculators
    ***********************************/

    //get calculator settings
    server.get("/api/mycalculator/settings/:calcid", function(req, res)
    {
        var calcid = req.params.calcid;

        CalculatorModel.findById(calcid,{brands:0,prisgrupper:0}, function (err, Calculator) {
            if (err) {
                res.json({success:false,message:'Something went wrong'});
                return;
            } else
            {
                res.json({success:true,settings:Calculator});

            }
        });
    });

    //get a price based on licensplate
    server.get("/api/mycalculator/:calcid/offer/licensplate/:licensplate", function(req, res)
    {
        var calcid = req.params.calcid;
        var licensplate = req.params.licensplate;
        Vehiclemodel.getVehicleByLicensplate(licensplate)
            .then(function(data){
                var modelId = data.ModelId;
                var vehicle = data;
                CalculatorModel.getOfferByModel24(calcid,modelId,function(err,data){
                    if(err){
                        res.json({success: false, message: 'Something went wrong'});
                    }else{
                        //We have data, do we have an offer?
                        if(data.length > 0){
                            res.json({success:true,hasoffer:true,offer:data[0].price,vehicle:vehicle});
                        }else{
                            res.json({success:true,hasoffer:false,vehicle:vehicle});
                        }
                    }
                });
            },function(err){
                 res.json({success: false, message: 'Something went wrong'});
            }
            );
    });

    //get a price based on model ID
    server.get("/api/mycalculator/:calcid/offer/model/:modelid", function(req, res)
    {
        var calcid = req.params.calcid;
        var modelId = req.params.modelid;

        CalculatorModel.getOfferByModel24(calcid,modelId,function(err,data){
            if(err){
                res.json({success: false, message: 'Something went wrong'});
            }else{
                //We have data, do we have an offer?
                if(data.length > 0){
                    res.json({success:true,hasoffer:true,offer:data[0].price});
                }else{
                    res.json({success:true,hasoffer:false});
                }
            }
        });
    });

    //get a brands list
    server.get("/api/mycalculator/:calcid/brands", function(req, res)
    {
        var calcid = req.params.calcid;
        var modelId = req.params.modelid;

        CalculatorModel.getBrandsList(calcid,function(err,data){
            if(err){
                res.json({success: false, message: 'Something went wrong'});
            }else{
                //We have data, returning list?
                res.json({success:true,brands:data});
            }
        });
    });

    //get a models list based on brand id
    server.get("/api/mycalculator/:calcid/models/:brandid", function(req, res)
    {
        var calcid = req.params.calcid;
        var brandid = req.params.brandid;

        CalculatorModel.getModelsList(calcid,brandid,function(err,data){
            if(err){
                res.json({success: false, message: 'Something went wrong'});
            }else{
                //We have data, returning list?
                res.json({success:true,models:data});
            }
        });
    });

    //sends mail to calculator owner from end user

    server.post('/api/mycalculator/:calcid/contact', function(req, res)
    {
        var calcid = req.params.calcid;
        CalculatorModel.findById(calcid,'settings', function (err, data) {
            if (err) {
                res.json({success:false,message:'Cant get settings!'});
                return;
            }
            //if no email exists in setting, we return false
            else if(!("email" in data.settings.calltoaction) ){
                    res.json({success:false,message:'no email!'});
                    return;
            }
            else{
                //we have an email to send to
                var mailto = data.settings.calltoaction.email;
                //use the customers mail to send from
                var mailfrom = req.body.email;
                //setting vehicledata up in a list
                var vehicledata = '';
                //if we have vehicledata
                if("vehicle" in  req.body.offer) {
                    for (key in req.body.offer.vehicle) {
                        vehicledata += '<li>' + key + ': ' + req.body.offer.vehicle[key] + '</li>';
                    }
                }
                //if we have manual search data
                if("search" in  req.body) {
                    vehicledata += '<li>Mærke : ' + req.body.search.brand.name + '</li>';
                    vehicledata += '<li>Model : ' + req.body.search.model.name + '</li>';
                }
                //output offer
                var offer = req.body.offer.hasoffer ? req.body.offer.offer : 'Intet';

                //setting up mail options
                //TODO - make use of html templates instead of hardcoding it here
                var mailOptions={
                    from: mailfrom,
                    to : mailto,
                    subject : 'Henvendelse fra prisberegner - bilapi.dk',
                    //text : '',
                    html: '<h1>Henvendelse fra din prisberegner</h1>' +
                    '<p>En bruger har udfyldt kontaktformularen på din prisberegner.</p>' +
                    '<ul>' +
                    '<li><strong>Navn: </strong> '+ req.body.name+'</li>' +
                    '<li><strong>Email: </strong> '+ req.body.email+'</li>' +
                    '<li><strong>Telefon: </strong> '+ req.body.phone+'</li>' +
                    '<li><strong>Besked: </strong> '+ req.body.message+'</li>' +
                    '</ul>' +
                    '<p>Beregnet tilbud: '+ offer +'</p>' +
                    '<p>Brugerens køretøj</p>' +
                    '<ul> ' + vehicledata + '</ul>'

                };
                // Send mail
                myMailer.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                        return res.json({success:false,message:'Kunne ikke sende mail! Kontakt administrator'});
                    }else{
                        //console.log("Message sent: " + info.response);
                        res.json({success:true,message:'Din besked er sendt'});
                    }
                });
            }
        });
    });


    /**********************************
    * Helpers
    **********************************/

    /*
     * isUserAdmin
     * Helper function to determine if user has admin rights
     *
     * @param username
     * @param callback
     * @return User Object
     */

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

};