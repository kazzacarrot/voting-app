var collection = "voting-app";

function PollHandler(db){

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
