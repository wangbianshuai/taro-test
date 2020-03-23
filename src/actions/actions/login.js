import { Common, Md5 } from "UtilsCommon";
import BaseIndex from "../baseIndex";

export default class Login extends BaseIndex {
    constructor(props) {
        super(props);

        this.name = "login";
        this.minActionType = 4000;
        this.maxActionType = 4099;

        this.init();
    }

    //login
    login(id, actionType, data) {
        data.entityData.LoginPassword = Md5(data.entityData.LoginPassword);
        this.dvaActions.dispatch("ApiService", "login", { action: this.getAction(id, actionType), User: data.entityData });
    }

    setlogin(id, actionType, data) {
        if (!this.receives[id]) return false;

        data = this.setApiResponse(data);

        if (data.isSuccess === false || !data.User) {
            Common.removeStorage("Token");

            return { isSuccess: false, message: "wrong username or password!" }
        }

        Common.setStorage("token", data.User.Token);

        return data.User;
    }
}
