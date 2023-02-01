import { useState, useEffect } from "react";
import { Post } from "./components/post";
import PostForm from "./components/PostForm";
import axios from "axios";

const getLocalstorage = () => {
  let post = localStorage.getItem("post");

  if (post) {
    return JSON.parse(localStorage.getItem("post") || "");
  }
  return [];
};

const App = () => {
  const [value, setValue] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>(getLocalstorage);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        "https://diary-app-sever.onrender.com/api/v1/diary/"
      );

      const data = response.data;

      if (response) {
        setPosts(data);
      }
    };
    getData();
  }, []);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await axios.post(
      "https://diary-app-sever.onrender.com/api/v1/diary/create",
      {
        post: value,
      }
    );

    const data = response.data;

    if (response) {
      setPosts((prev) => [data, ...prev]);
      setValue("");
    }
  };

  return (
    <>
      <div className="screen-full w-screen">
        <div>
          <form
            className="flex justify-center items-center flex-col
            mx-auto md:max-w-2xl max-w-[22rem]"
            onSubmit={submitHandler}
          >
            <textarea
              className="focus:shadow-soft-primary-outline mt-4 min-h-unset text-sm leading-5.6 ease-soft block h-auto w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-3 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none"
              placeholder="Write your thoughts here..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            ></textarea>
            <div className="mt-2 flex w-full justify-end ">
              <button
                type="submit"
                className="inline-block px-12 py-3 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
              >
                Post
              </button>
            </div>
          </form>

          <div className="flex justify-center items-center mt-3">
            <PostForm posts={posts} setPosts={setPosts} />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
