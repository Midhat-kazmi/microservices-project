import React, { useEffect, useState } from "react";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = () => {
  const [post, setPost] = useState({});

  const fetchPosts = async () => {
    const res = await fetch("http://posts.com/posts");
    const data = await res.json();
    setPost(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  // console.log("🚀 ~ PostList ~ post:", post);

  const renderedPosts = Object.values(post).map((post) => {
    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments} />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
};

export default PostList;
