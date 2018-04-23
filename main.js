var SpacebookApp = function () {
  var posts = [
    {text: "Hello world 1", id: 0, comments:[
      { text: "Man, this is a comment1!"},
      { text: "Man, this is a comment2!"},
      { text: "Man, this is a comment3!"}
    ]},
    {text: "Hello world 2", id: 1, comments:[
      { text: "Man, this is a comment4!"},
      { text: "Man, this is a comment5!"},
      { text: "Man, this is a comment6!"}
    ]},
    {text: "Hello world 3", id: 2, comments:[
      { text: "Man, this is a comment7!"},
      { text: "Man, this is a comment8!"},
      { text: "Man, this is a comment9!"}
    ]}
  ];

  // the current id to assign to a post
  var currentId = 3;
  var $posts = $('.posts');

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
      comments : new Array()
    }

    currentId += 1;

    posts.push(post);
  }

  var renderPosts = function () {
    $posts.empty();
    for (var i = 0; i < posts.length; i += 1) {
      var post = posts[i];

      var commentsContainer = '<div class="comments-container">' +
      '<input type="text" class="comment-name">' +
      '<button class="btn btn-primary add-comment">Post Comment</button> <div class="comments"></div> </div>';

      $posts.append('<div class="post" data-id=' + post.id + '>'
        + '<a href="#" class="remove">remove</a> ' + '<a href="#" class="show-comments">comments</a> ' + post.text +
        commentsContainer + '</div>');
    }
  }

  var removePost = function (currentPost) {
    var $clickedPost = $(currentPost).closest('.post');
    var id = $clickedPost.data().id;
    var post = _findPostById(id);
    posts.splice(posts.indexOf(post), 1);
    $clickedPost.remove();
  }

  var createComment = function (current) {
    var text = $(current).parent().find('.comment-name').val();
    var id = $(current).closest('.post').data().id;
    var post = _findPostById(id);
    post.comments.push( {text : text} );
  }

  var renderComments = function (currentPost) {
    var id = $(currentPost).closest('.post').data().id;
    var $comments = $(currentPost).parent().find(".comments");
    $comments.empty();
    var post = _findPostById(id);
    for (var i = 0; i < post.comments.length ; i += 1) {
      var comment = post.comments[i];
      $comments.append('<div class="comment" data-comment_id='+i+'>'
        + '<a href="#" class="remove_comment">remove</a> ' + comment.text + '</div>');
    }
  }

  var removeComment = function (currentComment) {
    var $fatherPost = $(currentComment).closest('.post');
    var $comment = $(currentComment).closest('.comment');
    var id = $fatherPost.data().id;
    var idComment = $comment.data().comment_id;

    var post = _findPostById(id);

    if(posts[id].comments.length == 1) {
      posts[id].comments = [];
    }
    else posts[id].comments.splice(idComment, 1);

    $(currentComment).parent().remove();
    console.log(posts[0].comments);
  }

  var toggleComments = function (currentPost) {
    var $clickedPost = $(currentPost).closest('.post');
    $clickedPost.find('.comments-container').toggleClass('show');
  }

  return {
    createPost: createPost,
    renderPosts: renderPosts,
    removePost: removePost,
    createComment: createComment,
    renderComments: renderComments,
    removeComment: removeComment,
    toggleComments: toggleComments
  }
}

var app = SpacebookApp();

// immediately invoke the render method
app.renderPosts();

// Events
$('.add-post').on('click', function () {
  var text = $('#post-name').val();
  app.createPost(text);
  app.renderPosts();
});

$('.posts').on('click', '.remove', function () {
  app.removePost(this);
});

$('.posts').on('click','.show-comments', function () {
  app.toggleComments(this);
  app.renderComments(this);
});

$('.posts').on('click','.add-comment', function () {
  app.createComment(this);
  app.renderComments(this);
});

$('.posts').on('click', '.remove_comment', function () {
  app.removeComment(this);
});
