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

router.route("/new_poll")
.get(function(req, res, next){
    res.render("new_poll")
})
.post(function(req, res, next){
    console.log(req.body);
    mongo.connect(mongo_uri, function(err, db){
        if (err) throw("can't connect to mongo");

        pollHandler = new PollHandler(db);
        pollHandler.newPoll(req, res, next);
    })
})

router.route('/poll/:poll_id')
.get(function(req, res, next){
    res.render("poll", req.poll)
})
.post(function( req, res, next){
    mongo.connect(mongo_uri, function(err, db){
        if (err) throw("can't connect to mongo");


        pollHandler = new PollHandler(db);
        pollHandler.submitChoice(req, res, next);

    })

})
.put(function(req, res, next){
    mongo.connect(mongo_uri, function(err, db){
        if (err) throw("can't connect to mongo");


        pollHandler = new PollHandler(db);
        pollHandler.newOption(req, res, next);

    })
})
.delete(function(req, res, next){
    mongo.connect(mongo_uri, function(err, db){
        if (err) throw("can't connect to mongo");


        pollHandler = new PollHandler(db);
        pollHandler.deletePoll(req, res, next);

    })
})



/* GET home page. */
router.get('/', function(req, res, next) {
    mongo.connect(mongo_uri, function(err, db){
        if (err) throw("can't connect to mongo");


        pollHandler = new PollHandler(db);
        pollHandler.listPollsOnFrontPage(req, res, next);

    })
});

module.exports = router;
