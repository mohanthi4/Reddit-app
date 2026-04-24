import { produce } from "immer";

export const subscribersReduce = (usersData, action) => {
  switch (action.type) {
    case "init-subscribers": {
      return produce(usersData, (draft) => action.content);
    }
    case "add-subscriber": {
      return produce(usersData, (draft) => {
        const index = draft.all.findIndex((x) => x.id === action.content.id);
        console.log(index, "index");
        draft.all[index].isSubscribe = true;
      });
    }
  }
};
