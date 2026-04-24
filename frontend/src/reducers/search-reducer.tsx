import { produce } from "immer";

export const subscribersReduce = (usersData, action) => {
  switch (action.type) {
    case "init-subscribers": {
      return produce(usersData, (draft) => action.content);
    }
  }
};
