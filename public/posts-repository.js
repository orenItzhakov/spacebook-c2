    /**
     * @class Responsible for storing and manipulating Spacebook posts, in-memory
     */
class PostsRepository {
    constructor(postsRenderer) {
      this.posts =[];
    }

    initData(){
      return $.get("posts", (data, status) =>{
        this.posts = data;
        console.log(this.posts);
      });
    }

    addPost(postText) {
      return $.post("posts", {text: postText}).then((result) => {
        if(result.status=="Ok"){
          this.posts.push({ _id:result.idInsert ,text: postText, comments: [] });
        }
      });
    }


    removePost(index) {
      var postID = this.posts[index]._id;
      return $.ajax({
        url: "posts" + '?' + $.param({"id": postID}),
        type: 'DELETE'
      }).then((result) => {
        if(result=="Ok"){
          this.posts.splice(index, 1);
        }
      });
    }

    addComment(newComment, postIndex) {
      return $.post("posts/" + this.posts[postIndex]._id + "/comments", {text: newComment.text , user:newComment.user}).then((result) => {
        if(result.status=="Ok"){
          newComment._id = result.id;
          this.posts[postIndex].comments.push(newComment);
        }
      });
    };

    deleteComment(postIndex, commentIndex) {
      var postID = this.posts[postIndex]._id;
      var commID = this.posts[postIndex].comments[commentIndex]._id;
      return $.ajax({
        url: "posts/deletecomment" + '?' + $.param({"id": postID, "idComment":commID}),
        type: 'DELETE'
      }).then((result) => {
        if(result=="Ok"){
          this.posts[postIndex].comments.splice(commentIndex, 1);
        }
      });
    };

}

export default PostsRepository
