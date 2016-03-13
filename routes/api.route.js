var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
    res.json({apiname:'Motorregister API'})

});

//vehicle by licensplate
router.get('/vehicle/licensplate/:licensplate',
    //isloggedin,
    //ensureAdmin,
    function(req,res){
        var plate = req.params.licensplate;
        var query = VehicleModel.findOne({Licensplate:plate});
        query.exec(function(err,data){
            if (err) {
                res.json(err);
            }else{
                res.json(data);
            }
        });
    });


module.exports = router;