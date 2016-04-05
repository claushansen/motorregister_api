module.exports = function(server, UserModel, passport)
{
    //login
    server.post('/api/login',passport.authenticate('local'),
        function(req, res) {
            //req.user.password = '*****' ;
            res.json({success:true,user:req.user});
            //res.redirect('/users/' + req.user.username);
        });

    // get logged in user
    server.get('/api/loggedin', function(req, res)
    {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    //logout
    server.get('/api/logout', function(req, res)
    {
        req.logOut();
        res.sendStatus(200);
    });

    //Register
    server.post('/api/register', function(req, res)
    {
        var newUser = req.body;

        UserModel.findOne({username: newUser.username}, function(err, user)
        {
            if(err) { return res.json({success:false,message:'Kunne ikke oprette bruger!'}); }
            if(user)
            {
                return res.json({success:false,message:'Username exists!'});

            }
            //make sure no one posts anything in roles array
            delete req.body.roles;
            var newUser = new UserModel(req.body);
            newUser.save(function(err, user)
            {
                if(err) { return res.json({success:false,message:'Kunne ikke oprette bruger!'}); }
                req.login(user, function(err)
                {
                    if(err)
                    {
                        res.json({success:false,message:'Kunne ikke oprette bruger!'});
                    }
                    res.json({success:true,user:user});
                });
            });
        });
    });

    //get all users as admin only
    server.get("/api/user", function(req, res)
    {
        if(req.isAuthenticated()) {
            isUserAdmin(req.user.username, function (user) {
                if (user != '0') {
                    UserModel.find(function (err, users) {
                        res.json({success:true,users:users});
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

    //get specific user only as admin or user owner
    server.get("/api/user/:id", function(req, res)
    {
        if(req.isAuthenticated()) {
            isUserAdmin(req.user.username, function (user) {
                if (user != '0' || req.user._id == req.params.id) {
                    UserModel.findById(req.params.id, function (err, user) {
                        res.json({success:true,user:user});
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

    // delete user only as admin
    server.delete("/api/user/:id", function(req, res)
    {
        if(req.isAuthenticated()) {
            isUserAdmin(req.user.username, function (user) {
                if (user != '0') {
                    UserModel.remove({_id: req.params.id}, function (err, count) {
                        if(err)
                        {
                            res.json({success:false,message:'error! Something went wrong'})
                            return;
                        }
                        res.json({success:true,message:'User removed'});
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

    //create new user as admin only
    server.post("/api/user", function(req, res)
    {
        if(req.isAuthenticated()) {
            isUserAdmin(req.user.username, function (user) {
                if(user == 0)
                {
                     res.json({success:false,message:'Not administrator!'})
                    return;
                }
                var newuser = req.body;

                UserModel.findOne({username: newuser.username}, function (err, existingUser) {
                    if (existingUser != null) {
                        res.json({success:false,message:'username exists!'});
                        return;
                    }
                    else {
                        UserModel.create(newuser, function (err, result) {
                            res.json({success:true,user:result});
                        });
                    }
                });
            });
        }
        else
        {
          res.json({success:false,message:'Not logged in!'});
        }
    });

    //updating user only by admin or user owner
    //TODO - check if username exists if it has changed
    server.put('/api/user/:id', function(req, res)
    {
        //removing _id from req.body as it creates an error on openshift
        // as it uses mongo version 2.4 where you can't update on _id
        delete req.body._id;
        if(req.isAuthenticated()) {
            isUserAdmin(req.user.username, function (adminuser) {
                if (adminuser != '0' || req.user._id == req.params.id) {
                    if (adminuser == '0'){
                        //making sure only admin post in roles array
                        delete req.body.roles;
                    }
                    //getting the user to be updated
                    UserModel.findById(req.params.id, function (err, foundUser) {
                        if (err) {
                            res.json({success:false,message:'no user to update!'});
                            return;
                        }
                        var updatedUser = req.body;
                        // if a password is posted we need to encrypt it
                        if(updatedUser.password) {
                            UserModel.encryptPassword(updatedUser.password, function (err, encrypted) {
                                if (err) {
                                    res.json({success: false, message: 'cant encrypt password!'});
                                    return;
                                } else {
                                    //replacing the posted password with the encrypted password
                                    updatedUser.password = encrypted;
                                    foundUser.update(updatedUser, function (err, count) {
                                        if (err) {
                                            res.json({success: false, message: 'User not updated!'});
                                            return;
                                        }
                                        res.json({success: true, message: 'User updated!'});
                                    });
                                }
                            });
                        }
                        //if no password is posted we just update the user
                        else {
                            foundUser.update(updatedUser, function (err, count) {
                                if (err) {
                                    res.json({success: false, message: 'User not updated!'});
                                    return;
                                }
                                res.json({success: true, message: 'User updated!'});
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

    // get my user
    server.get('/api/myuser', function(req, res)
    {
        if(req.isAuthenticated())
        {
            UserModel.findOne({username: req.user.username}, function(err, foundUser)
            {
                res.json({success:true,user:foundUser});
            }
            );
        }
        else
        {
            res.json({success:false,message:'Not logged in!'});
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