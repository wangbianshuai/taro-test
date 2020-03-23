const ActionTypes = {};

export default (name) => {
    if (ActionTypes[name]) return ActionTypes[name];
    const path = name.replace("_", "/");
    ActionTypes[name] = require(`./${path}`).default;
    return ActionTypes[name];
};