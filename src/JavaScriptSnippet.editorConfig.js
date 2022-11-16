/**
 * @typedef Property
 * @type {object}
 * @property {string} key
 * @property {string} caption
 * @property {string} description
 * @property {string[]} objectHeaders
 * @property {ObjectProperties[]} objects
 * @property {Properties[]} properties
 */

/**
 * @typedef ObjectProperties
 * @type {object}
 * @property {PropertyGroup[]} properties
 * @property {string[]} captions
 */

/**
 * @typedef PropertyGroup
 * @type {object}
 * @property {string} caption
 * @property {PropertyGroup[]} propertyGroups
 * @property {Property[]} properties
 */

/**
 * @typedef Properties
 * @type {PropertyGroup}
 */

/**
 * @typedef Problem
 * @type {object}
 * @property {string} property
 * @property {("error" | "warning" | "deprecation")} severity
 * @property {string} message
 * @property {string} studioMessage
 * @property {string} url
 * @property {string} studioUrl
 */

/**
 * @param {object} values
 * @param {Properties} defaultProperties
 * @param {("web"|"desktop")} target
 * @returns {Properties}
 */
export function getProperties(values, defaultProperties, target) {
    // Do the values manipulation here to control the visibility of properties in Studio and Studio Pro conditionally.
    /* Example
    if (values.myProperty === "custom") {
        delete defaultProperties.properties.myOtherProperty;
    }
    */
    return defaultProperties;
}

// /**
//  * @param {Object} values
//  * @returns {Problem[]} returns a list of problems.
//  */
// export function check(values) {
//    /** @type {Problem[]} */
//    const errors = [];
//    // Add errors to the above array to throw errors in Studio and Studio Pro.
//    /* Example
//    if (values.myProperty !== "custom") {
//        errors.push({
//            property: `myProperty`,
//            message: `The value of 'myProperty' is different of 'custom'.`,
//            url: "https://github.com/myrepo/mywidget"
//        });
//    }
//    */
//    return errors;
// }

// /**
//  * @param {object} values
//  * @param {boolean} isDarkMode
//  * @returns {object}
//  */
// export function getPreview(values, isDarkMode) {
//     // Customize your pluggable widget appearance for Studio Pro.
//     return {
//         type: "Container",
//         children: []
//     };
// }
export function getPreview(values, isDarkMode) {
    const mySvgImage = `<svg width="40" height="40" ><path fill="#fe5000" d="M32,20l-5.66,5.66-1.41-1.41,4.24-4.24-4.24-4.24,1.41-1.41,5.66,5.66Zm-21.17,0l4.24,4.24-1.41,1.41-5.66-5.66,5.66-5.66,1.41,1.41-4.24,4.24Zm6.96,9h-2.13l6.55-18h2.13l-6.55,18Z"/></svg>`;
    return {
        type: "Container",
        borders: true,
        backgroundColor: isDarkMode ? "#33231f" : "#fff6f3",
        borderRadius: 8,
        children: [
            {
                type: "RowLayout",
                columnSize: "grow",
                padding: 10,
                children: [
                    { type: "Image", document: mySvgImage, width: 40, grow: 0 },
                    {
                        type: "Container",
                        children: [
                            {
                                bold: true,
                                type: "Text",
                                fontColor: isDarkMode ? "#fe5000" : "#000",
                                fontSize: 12,
                                content: ` JavaScript Snippet`
                            },
                            {
                                type: "Text",
                                fontColor: isDarkMode ? "#fff" : "#000",
                                fontSize: 8,
                                content: ` ${values.jsCode}`
                            }
                        ],
                        grow: 1
                    }
                ]
            }
        ]
    };
}

// /**
//  * @param {Object} values
//  * @param {("web"|"desktop")} platform
//  * @returns {string}
//  */
// export function getCustomCaption(values, platform) {
//     return "JavaScriptSnippet";
// }
