$(document).ready(function(){

  var posts = new Array();
  var newPostId = 100;
  var newCommentId = 1;

  var addPost = function (val) {
    var post = {
      id : newPostId,
      text : val,
      comments : new Array()
    }
    posts.push(post);
    newPostId += 10;
    renderPosts();
  };

  $(".add-post").click(function() {
    if($("#post-name").val() !=""){
      addPost( $("#post-name").val() );
      $("#post-name").val("");
    }
    else alert("You must enter post");
  });

  var renderPosts = function() {

    $(".posts").empty();
    for (var i = 0; i < posts.length; i++) {
      var dataToAdd = "<div class='father'>  <p class='post' data-id='" + posts[i].id
        + "'>&#9658; <button type='button' class='btn btn-danger remove'>REMOVE</button> <button type='button' class='btn btn-warning showMe'>SHOW</button> <button type='button' class='btn btn-info comment'>COMMENTS : "+posts[i].comments.length+"</button><br>"
        + posts[i].text + "</p>"
        + "<div class='inside'><input type='text' class='form-control' style='width:80%;display:inline-block;' placeholder='Enter new comment'> <button type='button' class='btn btn-success add_comment'>ADD</button><div class='comments'><h2>Comments:</h2>";
      for (var j = 0; j < posts[i].comments.length; j++) {
        dataToAdd += "<p data-id='"+posts[i].id+"' data-comment_id='" + posts[i].comments[j].comment_id + "'><b>#</b> <span class='import'>" + posts[i].comments[j].comment_text + "</span> <span class='comment_time' title='last save date'>"+posts[i].comments[j].comment_time+"</span><i class='material-icons delete_comment' title='delete comment'>&#xE872;</i><i class='material-icons edit_comment' title='edit comment'>&#xE150;</i></p>";
      }
      dataToAdd += "</div></div></div>";
      $(".posts").append(dataToAdd);
    }

    $(".remove").click(function() {
      var idToDelete = $(this).parent().data().id ;
      var index ;
      for (var i = 0; i < posts.length; i++) {
        if(idToDelete == posts[i].id) index = i;
      }
      posts.splice(index, 1);
      renderPosts();
    });


    $(".showMe").click(function() {
      var idToShow = $(this).parent().data().id ;
      $(".all").hide();
      $(".specific").show();
      $(".specific").empty();
      for (var i = 0; i < posts.length; i++) {
        if(posts[i].id==idToShow){
          $(".specific").append("<h3>#  " + posts[i].text + "</h3><button type='button' class='btn btn-danger backToPosts' >BACK</button>");
          for (var j = 0; j < posts[i].comments.length; j++) {
            $(".specific").append("<p>&#9658" + posts[i].comments[j].comment_text + " <span class='comment_time' title='last save date'>"+posts[i].comments[j].comment_time+"</span></p>");
          }
        }
      }

      $(".backToPosts").click(function() {
        $(".all").show();
        $(".specific").hide();
      });

    });

    $(".delete_comment").click(function() {
      var idToDelete = $(this).parent().data().id ;
      var idToDeleteComment = $(this).parent().data().comment_id ;
      var index ;
      for (var i = 0; i < posts.length; i++) {
        if(idToDelete == posts[i].id){
          for (var j = 0 ; j < posts[i].comments.length ; j++) {
            if(idToDeleteComment == posts[i].comments[j].comment_id) index = j;
          }
          posts[i].comments.splice(index, 1);
        }
      }
      renderPosts();
    });

    $(".edit_comment").click(function() {
      var idToEdit = $(this).parent().data().id ;
      var idToEditComment = $(this).parent().data().comment_id ;
      var oldComment = $(this).parent().find(".import").text() ;
      var index ;
      $(this).parent().replaceWith("<div><input data-id='"+idToEdit+"' data-comment_id='"+idToEditComment+"' style='width:80%;display:inline-block;margin-bottom:10px;' type='text' class='form-control' value='" + oldComment + "'><button type='button' style='float:right' class='btn btn-success save_comment'>SAVE</button></div>")

      $(".save_comment").click(function() {
        var input = $(this).parent().find("input");
        var saveVal = input.val();
        var idToSave = input.data().id ;
        var idToSaveComment = input.data().comment_id ;
        for (var i = 0; i < posts.length; i++) {
          if(idToSave == posts[i].id){
            for (var j = 0 ; j < posts[i].comments.length ; j++) {
              if(idToSaveComment == posts[i].comments[j].comment_id){
                var d = new Date();
                var time = d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
                 posts[i].comments[j].comment_text = saveVal;
                 posts[i].comments[j].comment_time = time;
              }
            }
          }
        }
        renderPosts();
      });

    });

    $(".comment").click(function() {
      $(this).parent().next().slideToggle();
    });

    $(".add_comment").click(function() {
      var newComment = $(this).prev().val() ;
      var idToAddComment = $(this).closest(".father").find(".post").data().id;
      for (var i = 0; i < posts.length; i++) {
        if(idToAddComment == posts[i].id){
          var d = new Date();
          var time = d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
          var comm = { comment_text: newComment , comment_id : newCommentId ,comment_time:time} ;
          posts[i].comments.push(comm);
          newCommentId +=1 ;
        }
      }

      renderPosts();
    });

  };



});
