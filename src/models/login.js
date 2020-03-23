import DvaIndex from "DvaCommon";

const config = {
    name: "ApiService",
    serviceName: "ApiService",
    actionList: [
        post("login", "User/Login", "login", "login"),
        post("changePassword", "User/ChangePassword", "changePassword", "changePassword", true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken) {
    return { actionName: actionName, url: url, method: "POST", stateName: stateName, dataKey: dataKey, isToken }
}

export default DvaIndex(config);
