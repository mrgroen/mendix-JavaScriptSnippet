import "./ui/JavaScriptSnippet.css";
import { createElement, useEffect, useState } from "react";

export function JavaScriptSnippet({ attributeList, jsCode, ...rest }) {
    const self = this;
    const [canRender, setCanRender] = useState(false);
    const [javaScriptString, setJavaScriptString] = useState([]);
    const widgetName = rest.name || "";

    function escape(htmlStr) {
        return htmlStr
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    // function unEscape(htmlStr) {
    //     htmlStr = htmlStr.replace(/&lt;/g, "<");
    //     htmlStr = htmlStr.replace(/&gt;/g, ">");
    //     htmlStr = htmlStr.replace(/&quot;/g, '"');
    //     htmlStr = htmlStr.replace(/&#39;/g, "'");
    //     htmlStr = htmlStr.replace(/&amp;/g, "&");
    //     return htmlStr;
    // }

    useEffect(() => {
        let JavaScriptStringArray = jsCode;
        if (attributeList.length) {
            attributeList.map(attr => {
                if (attr.jsAttribute.status === "available") {
                    if (typeof attr.jsAttribute.value === "boolean") {
                        JavaScriptStringArray = JavaScriptStringArray.split("${" + attr.jsVarName + "}").join(
                            attr.jsAttribute.value
                        );
                    } else {
                        JavaScriptStringArray = JavaScriptStringArray.split("${" + attr.jsVarName + "}").join(
                            escape(attr.jsAttribute.value)
                        );
                    }
                }
                return null;
            });
        }
        setJavaScriptString(JavaScriptStringArray);

        if (!attributeList.length) {
            setCanRender(true);
        }

        // clean-up function
        return () => {
            if (attributeList.length) {
                setCanRender(true);
            }
        };
    }, [attributeList, jsCode]);

    if (canRender) {
        // JavaScript evaluation will be done in the context of the widget instance.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
        try {
            // eslint-disable-next-line space-before-function-paren
            (function () {
                // eslint-disable-next-line no-new-func
                Function(javaScriptString)();
            }.call(self));
            return null;
        } catch (error) {
            console.warn("Error while evaluating javascript input.");
            return (
                <div name={widgetName} className="alert alert-danger">
                    Error while evaluating javascript input: {error}
                </div>
            );
        }
    } else return null;
}
