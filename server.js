var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

const SERVER_PORT = 8080;

mongoose.connect('mongodb://localhost/spacebookDB', function() {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
app.get('/posts', function (req, res) {
  Post.find(function (error, result){
  if(error) { return console.error(error); }
    res.send(result);
  });
});

// 2) to handle adding a post
app.post('/posts', function (req, res) {
  var newPost = new Post({ text: req.body.text });
  newPost.save(function(requ,resp) {
    res.send({status: "Ok", idInsert:resp.id });
  });
});

// 3) to handle deleting a post
app.delete('/posts', function (req, res) {
  Post.remove({ _id: req.query.id }, function(err) {
    if (err) throw err;
    else res.send("Ok");
  });
});

// 4) to handle adding a comment to a post
app.post("/posts/:id/comments", function (req, res){
  var newComment = {text: req.body.text, user: req.body.user};
  Post.findByIdAndUpdate(req.params.id, { $push: { comments: newComment } }, {'new': true}, function (err, resp){
    if (err) throw err;
    else {
      var comId = resp.comments[resp.comments.length-1]._id;
      res.send({id: comId, status: "Ok"});
    }
  });
});

// 5) to handle deleting a comment from a post
app.delete("/posts/deletecomment", function (req, res){
  Post.update({ _id: req.query.id},{$pull: {comments : {_id: req.query.idComment} } },function (err, resp) {
    if (err) throw err;
    else res.send("Ok");
  });
});

app.listen(SERVER_PORT, () => {
  console.log("Server started on port " + SERVER_PORT);
});
