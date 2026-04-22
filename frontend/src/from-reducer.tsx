import { produce } from "immer";

export type PostData = {
  id?: number;
  user: string;
  date: string;
  title: string | undefined;
  description: string | undefined;
};

export type ReducerData =
  | { type: "update-feed"; content: PostData }
  | { type: "delete-feed"; content: number }
  | { type: "display-feed" };

export type FeedData = { nextId: number; feed: PostData[] };

export type FormReducer = (
  data: FeedData,
  action: ReducerData,
) => FeedData | undefined;

export const formReducer: FormReducer = (feedData, action) => {
  switch (action.type) {
    case "update-feed": {
      return produce(feedData, (draft) => {
        draft.feed.unshift({
          ...action.content,
          id: draft.nextId++,
        });
      });
    }

    case "delete-feed": {
      return produce(feedData, (draft) => {
        const feedIndex = draft.feed.findIndex(
          (feed) => feed.id === action.content,
        );
        draft.feed.splice(feedIndex, 1);
      });
    }

    case "display-feed": {
      return produce(feedData, (draft) => action.content);
    }
  }
};
