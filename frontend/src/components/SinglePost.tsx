import React, { useEffect, useState } from "react";
import { Post } from "./post";
import axios from "axios";

interface Props {
  item: Post;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const SinglePost: React.FC<Props> = ({ item, posts, setPosts }) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editPost, setEditPost] = useState<string>(item.post);

  useEffect(() => {
    localStorage.setItem("post", JSON.stringify(posts));
  }, [posts]);

  const editHandler = async (id: number) => {
    const response = await axios.patch(
      `https://diary-app-sever.onrender.com/api/v1/diary/update/${id}`,
      { post: editPost }
    );

    const data = response.data;

    setPosts(
      posts.map((item) =>
        item._id === id ? { ...item, post: data.post } : item
      )
    );
    setEdit(false);
  };

  const deleteHandler = async (id: number) => {
    const response = await axios.delete(
      `https://diary-app-sever.onrender.com/api/v1/diary/delete/${id}`
    );

    const data = response.data;

    setPosts(posts.filter((item) => item._id !== data._id));

    localStorage.removeItem("post");
  };

  return (
    <form className="bg-white mb-4 md:max-w-2xl  w-screen md:mx-auto mx-1 max-w-[22rem] rounded-md">
      <p className="p-3">{item.createdAt}</p>
      <div className="bg-gray-200 h-[1px] max-w-4xl mx-3"></div>
      {edit ? (
        <textarea
          className="focus:shadow-soft-primary-outline mt-4 min-h-unset text-sm leading-5.6 ease-soft block h-auto w-screen max-w-[650px] mx-auto appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-3 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none"
          placeholder={editPost}
          value={editPost}
          onChange={(e) => setEditPost(e.target.value)}
        ></textarea>
      ) : (
        <h3 className="p-4">{item.post}</h3>
      )}

      <div className="bg-gray-200 h-[1px] max-w-4xl mx-3"></div>

      {edit ? (
        <div className="w-full flex justify-end mt-2 space-x-1 p-1">
          <button
            onClick={() => editHandler(item._id)}
            type="button"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            done
          </button>
        </div>
      ) : (
        <div className="w-full flex justify-end mt-2 space-x-1 p-1">
          <button
            onClick={() => {
              if (!edit) {
                setEdit(!edit);
              }
            }}
            type="button"
            className="inline-block px-6 py-2.5 bg-yellow-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-700 active:shadow-lg transition duration-150 ease-in-out"
          >
            edit
          </button>
          <button
            onClick={() => deleteHandler(item._id)}
            type="button"
            className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            delete
          </button>
        </div>
      )}
    </form>
  );
};

export default SinglePost;
