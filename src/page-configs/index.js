const PageConfigs = {};

export default (name) => {
    if (PageConfigs[name]) return PageConfigs[name];
    const path = name.replace("_", "/");
    PageConfigs[name] = require(`./pages/${path}`).default;
    return PageConfigs[name];
};