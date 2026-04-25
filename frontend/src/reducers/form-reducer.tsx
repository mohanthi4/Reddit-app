import { produce } from "immer";

export type PostData = {
  _id?: number;
  user: string;
  date: string;
  title: string | undefined;
  description: string | undefined;
};

export type ReducerData =
  | { type: "add-post"; content: PostData }
  | { type: "delete-post"; content: number }
  | { type: "init-posts" };

export type FeedData = { nextId: number; feed: PostData[] };

export type FormReducer = (
  data: FeedData,
  action: ReducerData,
) => FeedData | undefined;

export const formReducer: FormReducer = (feedData, action) => {
  switch (action.type) {
    case "add-post": {
      return produce(feedData, (draft) => {
        const newPost = {
          ...action.content,
          _id: draft.nextId,
        };
        draft.nextId++;
        draft.posts.unshift(newPost);
      });
    }

    case "delete-post": {
      return produce(feedData, (draft) => {
        draft.posts = draft.posts.filter((post) => post._id !== action.content);
      });
    }

    case "init-posts": {
      return produce(feedData, (draft) => action.content);
    }

    case "like-post":
      return produce(feedData, (draft) => {
        const post = draft.posts.find((p) => p._id === action.content.id);
        if (!post) return;
        if (post && !post.likedUsers.includes(action.content.currentUser)) {
          post.likedUsers.push(action.content.currentUser);
          post.likes++;
        }
      });

    case "unlike-post":
      return produce(feedData, (draft) => {
        const post = draft.posts.find((p) => p._id === action.content.id);
        if (!post) return;
        post.likedUsers = post.likedUsers.filter(
          (u) => u !== action.content.currentUser,
        );
        post.likes -= 1;
      });
  }
};
