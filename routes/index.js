var express = require('express');
var router = express.Router();
var PollHandler = require(process.cwd() + "/controllers/poll_handler.server.js");
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
    mongo.connect(mongo_uri, function(err, db){
        if (err) throw("can't connect to mongo");

        console.log(req.body);
        r = req.body;
        answer = {
            "text" : r["answer"]
        }

        pollHandler = new PollHandler(db, answer);
        pollHandler.submitChoice(req, res, next);

    })
})


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
