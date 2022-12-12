import "./ui/JavaScriptSnippet.css";
import { createElement, useEffect, useState } from "react";

export function JavaScriptSnippet({ attributeList, jsCode, ...rest }) {
    const [canRender, setCanRender] = useState(false);
    const [javaScriptString, setJavaScriptString] = useState([]);
    const widgetName = rest.name || "";
    const uid = useState((Date.now().toString(36) + Math.random().toString(36).substring(2)));

    function escape(htmlStr) {
        return htmlStr
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    };

    // function unEscape(htmlStr) {
    //     htmlStr = htmlStr.replace(/&lt;/g, "<");
    //     htmlStr = htmlStr.replace(/&gt;/g, ">");
    //     htmlStr = htmlStr.replace(/&quot;/g, '"');
    //     htmlStr = htmlStr.replace(/&#39;/g, "'");
    //     htmlStr = htmlStr.replace(/&amp;/g, "&");
    //     return htmlStr;
    // }

    useEffect(() => {
        let JSArray = jsCode;

        if (attributeList.length) {
            attributeList.map(attr => {
                if (attr.jsAttribute.status === "available") {
                    const useValue =
                        attr.jsAttribute.value && attr.jsAttribute.value !== undefined
                            ? attr.jsAttribute.value
                            : attr.jsEmptyValue;

                    if (useValue === "" && typeof attr.jsAttribute.value !== "boolean") {
                        console.warn(
                            `${widgetName}: variable name "${attr.jsVarName}" is empty and also it's empty value replacement`
                        );
                    }

                    if (typeof attr.jsAttribute.value === "boolean") {
                        JSArray = JSArray.split("${" + attr.jsVarName + "}").join(attr.jsAttribute.value);
                    } else if (Object.prototype.toString.call(attr.jsAttribute.value) === "[object Date]") {
                        JSArray = JSArray.split("${" + attr.jsVarName + "}").join(useValue);
                    } else if (typeof attr.jsAttribute.value === "object") {
                        JSArray = JSArray.split("${" + attr.jsVarName + "}").join(useValue.toNumber());
                    } else {
                        JSArray = JSArray.split("${" + attr.jsVarName + "}").join(escape(useValue));
                    }
                }
                return null;
            });
        }
        
        JSArray = JSArray.split("this").join(`'${widgetName}_${uid[0]}'`);
        setJavaScriptString(JSArray);

        if (!attributeList.length) {
            setCanRender(true);
        }

        // clean-up function
        return () => {
            if (attributeList.length) {
                setCanRender(true);
            }
        };
    }, [attributeList, jsCode, widgetName]);

    if (canRender) {
        // JavaScript evaluation will be done in the context of the widget instance.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
        try {
            // eslint-disable-next-line no-new-func
            Function(javaScriptString)();
        } catch (error) {
            console.warn(`${widgetName}: Error while evaluating javascript input. ${error}`);
        }
    }
    return <div className={`${widgetName}_${uid[0]}`}></div>;
}
