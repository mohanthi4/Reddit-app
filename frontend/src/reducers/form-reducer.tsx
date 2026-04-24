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
        draft.posts.unshift({ ...action.content, _id: draft.nextId++ });
      });
    }

    case "delete-post": {
      return produce(feedData, (draft) => {
        const feedIndex = draft.posts.findIndex(
          (post) => post._id === action.content,
        );
        draft.posts.splice(feedIndex, 1);
      });
    }

    case "init-posts": {
      return produce(feedData, (draft) => action.content);
    }

    case "add-like": {
      return produce(feedData, (draft) => {
        const feedIndex = draft.posts.findIndex(
          (post) => post._id === action.content.id,
        );
        draft.posts[feedIndex].likes++;
        draft.posts[feedIndex].likedUsers.push(action.content.currentUser);
        console.log(draft, "---> in reducer");
      });
    }
  }
};
