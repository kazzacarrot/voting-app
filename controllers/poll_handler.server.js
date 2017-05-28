var collection = "voting-app";

function PollHandler(db){
    
    this.newPoll = function(req, res){

        var col = db.collection(collection);
        var slug = req.body.question.toLowerCase();
        slug = slug.replace(/\s/g, "_");
        slug = slug.replace("?", "");
        ans = JSON.parse(JSON.stringify(req.body));
        delete ans["question"];
        var answers = []
        Object.keys(ans).forEach(function(key, index){
            answers.push({text: ans[key], count: 0 });
        } )
        poll = {
            "question": req.body.question,
            "slug": slug,
            "answers": answers
        }

        console.log(poll);
        col.insert(poll, function(err, doc){
            res.redirect("/poll/" + slug);
            db.close();

        })

    }
    this.deletePoll = function(req, res){
        poll = req.poll;
        col = db.collection(collection);
        col.remove(poll, function(err, doc){ 
            if (err) res.status(500).send(err);
            else res.send("OK");
        })
    }

    this.listPollsOnFrontPage = function(req, res){

        col = db.collection(collection);
        col.find().toArray(function(err, docs){
            res.render("index", {"polls": docs});
        })
    }

    this.newOption = function(req, res){
        console.log(req.body);
        r = req.body;
        newChoice = {
            "text" : r["option"],
            "count": 0

        }
        console.log(newChoice);
        if (newChoice.text === undefined){
            res.render("error", {"message": "Cannot create option with no text!", error: {status: "Don't be stupid, Stupid!"}});
        }
        else{
            alreadyExists = false;
            req.poll.answers.forEach(function(answer, answerindex) {
                console.log(answer);
                console.log(answerindex)
                    if (newChoice.text.toLowerCase() == answer.text.toLowerCase()){
                        alreadyExists = true;
                    }

            })
            if (alreadyExists){
                res.status(500).send("error: That option already exists!");
            }
            else {
                query=    {
                    "_id":          req.poll._id,
                }
                col = db.collection(collection);
                col.findAndModify( query,
                        [[    "_id", "asc" ]],
                        {
                            $addToSet:
                            {"answers" : newChoice }
                        },{
                            new:true,
                        },
                        function(err, docs){
                            if (err) console.error(err);
                            console.log(docs);
                            db.close(); 
                            res.render("done", docs)
                        })
            }
        }
    }

    this.submitChoice = function(req, res){

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
        }
    }
}

module.exports = PollHandler;
