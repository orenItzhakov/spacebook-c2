var SpacebookApp = function () {
  var STORAGE_ID = 'spacebook';
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
  }

  var renderPosts = function () {
    $('.posts').empty();
    var source = $('#store-template-posts').html();
    var template = Handlebars.compile(source);
    var newHTML = template({posts : posts});
    $('.posts').append(newHTML);
    saveToLocalStorage();
  }

  var editPost = function (currentPost) {
    var $post = $(currentPost).closest('.post');
    var text = $post.find(".post_text").text();
    $post.find(".buttons").hide();
    $post.find(".post_text").replaceWith("<input class='post_val' type='text' value='" + text + "'><i class='material-icons save_post' title='Save post'>save</i>");
  }

  var savePost = function (id , text) {
    var post = _findPostById(id);
    post.text = text;
  }

  var saveComment = function (id , idComment , text) {
    var post = _findPostById(id);
    post.comments[idComment].text = text;
  }

  var removePost = function (id) {
    var post = _findPostById(id);
    posts.splice(posts.indexOf(post), 1);
  }

  var createComment = function (id , text) {
    var post = _findPostById(id);
    post.comments.push( {text : text} );
  }

  var editComment = function (currentPost) {
    var $comment = $(currentPost).closest('.comment');
    var text = $comment.find(".comment_text").text();
    $comment.find(".button_comments").hide();
    $comment.find(".comment_text").replaceWith("<input class='comment_val' type='text' value='" + text + "'><i class='material-icons save_comment' title='Save comment'>save</i>");
  }

  var removeComment = function (id , idComment) {
    var post = _findPostById(id);
    if(post.comments.length == 1) {
      post.comments = [];
    }
    else post.comments.splice(idComment, 1);
  }

  var toggleComments = function (id) {
    var post = _findPostById(id);
    post.isOpen = !post.isOpen;
  }

  var saveToLocalStorage = function () {
    localStorage.setItem(STORAGE_ID, JSON.stringify(posts));
  }

  var getFromLocalStorage = function () {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
  }

  var posts = getFromLocalStorage();
  
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
    $('#post-name').val("");
  }
  else alert("Input field is empty! please enter a post");
});

$('.posts').on('click', '.remove', function () {
  var id = $(this).closest('.post').data().id;
  app.removePost(id);
  app.renderPosts();
});

$('.posts').on('click', '.edit_post', function () {
  app.editPost(this);
});

$('.posts').on('click', '.save_post', function () {
  var $post = $(this).closest('.post');
  var id = $post.data().id;
  var text = $post.find(".post_val").val();
  app.savePost(id , text);
  app.renderPosts();
});

$('.posts').on('click', '.save_comment', function () {
  var $post = $(this).closest('.post');
  var id = $post.data().id;
  var $comment = $(this).closest('.comment');
  var idComment = $comment.data().comment_id;
  var text = $post.find(".comment_val").val();
  app.saveComment(id , idComment , text);
  app.renderPosts();
});

$('.posts').on('click','.show_comments', function () {
  var $post = $(this).closest('.post');
  var id = $post.data().id;
  app.toggleComments(id);
  $post.find('.comments-container').toggleClass('show');
});

$('.posts').on('click','.add_comment', function () {
  var text = $(this).parent().find('.comment-name').val();
  if(text != ""){
    var id = $(this).closest('.post').data().id;
    app.createComment(id , text);
    app.renderPosts();
    $(this).parent().find('.comment-name').val("");
  }
  else alert("Input field is empty! please enter a comment");
});

$('.posts').on('click','.remove_comment', function () {
  var id = $(this).closest('.post').data().id;
  var idComment = $(this).closest('.comment').data().comment_id;
  app.removeComment(id , idComment);
  app.renderPosts();
});

$('.posts').on('click','.edit_comment' , function(){
  app.editComment(this);
});
