export default function (name, properties = {}) {
    const element = document.createElement(name);
    for (const property in properties) {
        switch (property) {
            case "dataset":
                for (const dataAttributeName in properties.dataset) {
                    element.dataset[dataAttributeName] = properties.dataset[dataAttributeName];
                }
                break;
            case "children":
                properties.children.forEach(child => element.append(child));
                break;
            default:
                element[property] = properties[property];
        }
    }
    return element;
}
