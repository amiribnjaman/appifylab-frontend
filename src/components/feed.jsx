"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CreatePostCard from "@/components/createPostCard";
import Image from "next/image";
import { UserOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { SERVER_URL } from "@/utilitis/SERVER_URL";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function Feed() {
  const [createPostCard, setCreatePostCard] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState("");
  const [postId, setPostId] = useState("");
  const [reload, setReload] = useState(false)
  const [moreOption, setMoreOption] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // POST DATA FETCHING
  useEffect(() => {
    fetch(`${SERVER_URL}/post/allpost`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          setPosts(data.data);
        }
      });
  }, [reload]);

  // HANLDE COMMENT SUBMIT
  const commentSubmit = async (d) => {
    const data = {
      comment: d.comment,
      postId: postId,
      userId: "",
    };

    if (d.comment) {
      await axios
        .patch(`${SERVER_URL}/post/createComment`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
      .then(res => {
        setReload(!reload);
        console.log(res)
      })
    }

    reset()
  };

  // HANDLE COMMENT BOX SHOWING
  const handleCommentBox = (id) => {
    setPostId(id);
    setShowCommentBox(true)
  };

  // HANDLE MORE OPTION BUTTON
  const handleMoreOption = (id) => {
    setPostId(id)
    setMoreOption(!moreOption)
  }

  return (
    <>
      {/*=============== CREATE POST SECTION================ */}
      <div
        className={`${
          createPostCard ? "backdrop-blur-md" : ""
        } bg-white w-[90%] mr-auto px-2 py-3 shadow border rounded-md`}
      >
        <div className="mx-3 ">
          <div className="flex gap-2 justify-between mb-3">
            <div className="w-12 h-12 rounded-full bg-gray-100"></div>
            <div className="w-[87%]">
              <button
                onClick={() => setCreatePostCard(!createPostCard)}
                className="bg-[#F0F2F5] text-[18px] hover:bg-[#E4E6E9] text-[#606266] w-full text-left px-4 py-2 px-3 rounded-full"
              >
                What's on your mind? Mr. X
              </button>

              {/* =========================== */}
              {/*--------------CREATE POST CARD-------------- */}
              <div
                className={`${
                  createPostCard ? "block" : "hidden"
                } shadow-md border py-4 rounded-md w-[500px] fixed top-[10%] left-[3px] z-50 bg-white`}
              >
                <CreatePostCard
                  reload={reload}
                  setReload={setReload}
                  createPostCard={createPostCard}
                  setCreatePostCard={setCreatePostCard}
                />
              </div>
            </div>
          </div>
          <hr />

          {/*------------- POST TYPES---------- */}
          <div>
            <ul className="flex font-semibold text-gray-500 justify-between py-3">
              <li>Live video</li>
              <li>Photo/video</li>
              <li>Felling/activity</li>
            </ul>
          </div>
        </div>
      </div>

      {/*========================NEWS FEED========================*/}
      {posts.length > 0 &&
        posts.map((post) => (
          <div className="mt-6 w-[90%] relative py-6 mr-auto rounded-md border shadow">
            {/*---------POST HEADEING------------*/}
            {/*----------USER------------ */}
            <div className="flex justify-between px-4">
              <div className="flex gap-3">
                {/* <Image
              src={''}
              alt=""
              width={30}
              height={30}
              className="rounded-full"
            /> */}
                <div className="w-[40px] cursor-pointer h-[40px] rounded-full bg-gray-200 flex items-center justify-center">
                  <UserOutlined size={50} />
                </div>
                <div>
                  <h3 className="font-semibold m-0">
                    <Link href="">
                      {post?.userName ? post?.userName : "Mr. X"}
                    </Link>
                  </h3>
                  <span className="text-[12px] text-gray-500 -mt-4 inline-block font-normal">
                    At {post?.createOn.split("T")[1].split(".")[0]},{" "}
                    {post?.createOn.split("T")[0]}
                  </span>
                </div>
              </div>
              <div>
                <Button onClick={() => handleMoreOption(post?.id)} type="text">
                  <EllipsisOutlined
                    style={{ fontSize: "22px", fontWeight: "semi-bold" }}
                  />
                </Button>

                {/*-------------------MORE OPTION CARD------------ */}
                {post?.id == postId && (
                  <div
                    className={`${
                      moreOption ? "block" : "hidden"
                    } absolute border px-4 py-6 rounded-md shadow-md flex flex-col gap-3 z-50 bg-white top-[55px] right-[10px]`}
                  >
                    
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                )}
              </div>
            </div>

            {/*---------POST CONTENT----------- */}
            <div>
              <p className="my-3 px-4">{post?.post && post?.post}</p>
              <div className="mb-4">
                <img src={post?.imgUrl && post?.imgUrl} alt="" />
                {/* <Image height={500} width={500} alt="" src={post.imgUrl} /> */}
              </div>
            </div>

            {/*------------SHOWING INTERECTION COUNT----------- */}
            <p className="px-4">
              {post?.likes?.length && post?.likes?.length + "Likes"}{" "}
            </p>
            {/*------------USER INTERECTION INTO POST---------- */}
            <hr />
            <div className="my-2 px-4 flex justify-between">
              <Button>Like</Button>
              <Button onClick={() => handleCommentBox(post?.id)}>
                Comment
              </Button>
              <Button>Share</Button>
            </div>
            <hr />
            {/*---------------COMMENT SECTION------------ */}
            <div className="px-4 my-2">
              <p className="font-semibold my-3">
                {post?.comments.length > 0 &&
                  post?.comments.length + " Comments"}
              </p>
              {post?.comments.length > 0 && (
                <div>
                  {post?.comments.map((com) => (
                    <div className="px-4 my-4 flex gap-2">
                      <div className="w-[35px] h-[35px] rounded-full bg-gray-200"></div>
                      <div>
                        <h4 className="font-semibold">Mr. X</h4>
                        <p className="font-normal text-[14px]">
                          {com?.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {post.id == postId && (
                <form
                  className={`${showCommentBox ? "block" : "hidden"}`}
                  onSubmit={handleSubmit(commentSubmit)}
                >
                  <input
                    {...register("comment", { required: true })}
                    className="w-full py-4 px-6 border rounded-md focus:outline-none focus:border"
                    type="text"
                    placeholder="write comment.."
                  />
                  <input
                    {...register("postId")}
                    className="hidden w-full py-4 px-6 rounded-md focus:outline-none focus:border"
                    type="text"
                    value={post?.id}
                    placeholder="write comment.."
                  />
                  <button
                    type="submit"
                    className="bg-[#0866FF] px-4 py-1 mt-2 rounded-md text-white"
                  >
                    Comment
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
    </>
  );
}