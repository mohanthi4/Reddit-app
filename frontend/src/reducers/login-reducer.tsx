import { produce } from "immer";

export const LoginReducer = (loginInfo, action) => {
  switch (action.type) {
    case "init-login": {
      return produce(loginInfo, (draft) => (draft = action.content));
    }
    default:
      return loginInfo;
  }
};
