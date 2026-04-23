import { produce } from "immer";

export const LoginReducer = (loginInfo, action) => {
  switch (action.type) {
    case "init-user": {
      return produce(loginInfo, (draft) => action.content);
    }
    case "user-login": {
      console.log(action.content);
      return produce(loginInfo, (draft) => action.content);
    }
  }
};
