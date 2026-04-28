import { produce } from "immer";

export const LoginReducer = (loginInfo, action) => {
  switch (action.type) {
    case "init-login": {
      console.log(action.content, "data");
      return produce(loginInfo, (draft) => (draft = action.content));
    }
    default:
      return loginInfo;
  }
};
