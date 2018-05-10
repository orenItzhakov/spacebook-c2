var express = require('express');
var app = express();

app.listen(8000,function() {
  console.log("Server run... spacebook");
})
app.use(express.static("public"));
app.use(express.static('node_modules'));
