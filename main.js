var SpacebookApp = function () {
  var posts = [];

  // the current id to assign to a post
  var currentId = 0;

  var _findPostById = function (id) {
    for (var i = 0; i < posts.length; i += 1) {
      if (posts[i].id === id) {
        return posts[i];
      }
    }
  }

  var createPost = function (text) {
    var post = {
      text: text,
      id: currentId,
      isOpen : false,
      comments : new Array()
    }
    currentId += 1;
    posts.push(post);
    $('#post-name').val("");
  }

  var renderPosts = function () {
    $('.posts').empty();
    var source = $('#store-template-posts').html();
    var template = Handlebars.compile(source);
    var newHTML = template({posts : posts});
    $('.posts').append(newHTML);
  }

  var editPost = function (currentPost) {
    var $post = $(currentPost).closest('.post');
    var text = $post.find(".post_text").text();
    $post.find(".buttons").hide();
    $post.find(".post_text").replaceWith("<input class='post_val' type='text' value='" + text + "'><i class='material-icons save_post' title='Save post'>save</i>");
  }

  var savePost = function (currentPost) {
    var $post = $(currentPost).closest('.post');
    var id = $post.data().id;
    var new_text = $post.find(".post_val").val();
    var post = _findPostById(id);
    post.text = new_text;
  }

  var saveComment = function (currentComment) {
    var $post = $(currentComment).closest('.post');
    var id = $post.data().id;
    var $comment = $(currentComment).closest('.comment');
    var idComment = $comment.data().comment_id;

    var new_text = $post.find(".comment_val").val();
    var post = _findPostById(id);
    post.comments[idComment].text = new_text;
  }

  var removePost = function (currentPost) {
    var $clickedPost = $(currentPost).closest('.post');
    var id = $clickedPost.data().id;
    var post = _findPostById(id);
    posts.splice(posts.indexOf(post), 1);
  }

  var createComment = function (current) {
    var text = $(current).parent().find('.comment-name').val();
    if(text != ""){
      var id = $(current).closest('.post').data().id;
      var post = _findPostById(id);
      post.comments.push( {text : text} );
      $(current).parent().find('.comment-name').val("");
    }
    else alert("Input field is empty! please enter a comment");
  }

  var editComment = function (currentPost) {
    var $comment = $(currentPost).closest('.comment');
    var text = $comment.find(".comment_text").text();
    $comment.find(".button_comments").hide();
    $comment.find(".comment_text").replaceWith("<input class='comment_val' type='text' value='" + text + "'><i class='material-icons save_comment' title='Save comment'>save</i>");
  }

  var removeComment = function (currentComment) {
    var $fatherPost = $(currentComment).closest('.post');
    var $comment = $(currentComment).closest('.comment');
    var id = $fatherPost.data().id;
    var idComment = $comment.data().comment_id;
    var post = _findPostById(id);

    if(post.comments.length == 1) {
      post.comments = [];
    }
    else post.comments.splice(idComment, 1);
  }

  var toggleComments = function (currentPost) {
    var $clickedPost = $(currentPost).closest('.post');
    var id = $clickedPost.data().id;
    var post = _findPostById(id);
    post.isOpen = !post.isOpen;
    $clickedPost.find('.comments-container').toggleClass('show');
  }

  return {
    createPost: createPost,
    renderPosts: renderPosts,
    editPost: editPost,
    savePost: savePost,
    removePost: removePost,
    createComment: createComment,
    removeComment: removeComment,
    saveComment: saveComment,
    editComment: editComment,
    toggleComments: toggleComments
  }
}

var app = SpacebookApp();

// immediately invoke the render method
app.renderPosts();

// Events
$('.add_post').on('click', function () {
  var text = $('#post-name').val();
  if(text != ""){
    app.createPost(text);
    app.renderPosts();
  }
  else alert("Input field is empty! please enter a post");
});

$('.posts').on('click', '.remove', function () {
  app.removePost(this);
  app.renderPosts();
});

$('.posts').on('click', '.edit_post', function () {
  app.editPost(this);
});

$('.posts').on('click', '.save_post', function () {
  app.savePost(this);
  app.renderPosts();
});

$('.posts').on('click', '.save_comment', function () {
  app.saveComment(this);
  app.renderPosts();
});

$('.posts').on('click','.show_comments', function () {
  app.toggleComments(this);
});

$('.posts').on('click','.add_comment', function () {
  app.createComment(this);
  app.renderPosts();
});

$('.posts').on('click','.remove_comment', function () {
  app.removeComment(this);
  app.renderPosts();
});

$('.posts').on('click','.edit_comment' , function(){
  app.editComment(this);
});
