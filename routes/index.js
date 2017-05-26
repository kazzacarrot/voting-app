var express = require('express');
var router = express.Router();

var mongo_uri = process.env.MONGOLAB_URI;
var collection = "voting-app";
var mongo = require("mongodb").MongoClient;



router.param("poll_id", function(req, res, next, id, name){
    poll = {
        slug: id,
    }
    mongo.connect(mongo_uri, function(err, db){
        if (err) next(new Error("can't connect to mongo"));

        col = db.collection(collection);
        col.find(poll).toArray(function(err, docs){
            db.close();
            console.log(docs);
            if (err) next(new Error("unable to query"));
            req.poll = docs[0];
            next();
        })
    })
})


router.route('/poll/:poll_id')
.get(function(req, res, next){
    res.render("poll", req.poll)
})
.post(function( req, res, next){
    console.log(req.body);
    r = req.body;
    answer = {
        "text" : r["answer"]
    }
    if (answer.text === undefined){
        res.render("error", {"message": "You have to pick one.", error: {status: "ain't no point if you don't pick one."}});
    }
    else{
        console.log(answer);
        mongo.connect(mongo_uri, function(err, db){
            if (err) next(new Error("can't connect to mongo"));

            query=    {
                "_id":          req.poll._id,
                "answers.text" : answer.text
            }
            console.log(query);
            col = db.collection(collection);
            col.findAndModify( query,
                    [[    "_id", "asc" ]],
                    {
                        $inc: {"answers.$.count":1}
                    },
                    function(err, docs){
                        if (err) console.error(err);
                        console.log(docs);
                        db.close(); 
                        res.render("done", req.poll)
                    })
        })
    }
})


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
