import { produce } from "immer";

export type PostData = {
  id?: number;
  user: string;
  date: string;
  title: string | undefined;
  description: string | undefined;
};

export type ReducerData =
  | { type: "update-posts"; content: PostData }
  | { type: "delete-posts"; content: number }
  | { type: "display-posts" };

export type FeedData = { nextId: number; feed: PostData[] };

export type FormReducer = (
  data: FeedData,
  action: ReducerData,
) => FeedData | undefined;

export const formReducer: FormReducer = (feedData, action) => {
  switch (action.type) {
    case "update-posts": {
      return produce(feedData, (draft) => {
        draft.posts.unshift({
          ...action.content,
          id: draft.nextId++,
        });
      });
    }

    case "delete-posts": {
      return produce(feedData, (draft) => {
        const feedIndex = draft.posts.findIndex(
          (post) => post.id === action.content,
        );
        draft.posts.splice(feedIndex, 1);
      });
    }

    case "display-posts": {
      return produce(feedData, (draft) => action.content);
    }
  }
};
