import "./ui/JavaScriptSnippet.css";
import { createElement, useEffect, useState } from "react";

export function JavaScriptSnippet({ attributeList, jsCode }) {
    const self = this;
    const [canRender, setCanRender] = useState(false);
    const [javaScriptString, setJavaScriptString] = useState([]);

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
        if (attributeList) {
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
                    return setJavaScriptString(JavaScriptStringArray);
                } else return null;
            });
        }
        setCanRender(true);
    }, [javaScriptString, attributeList, jsCode]);

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
            return <div className="alert alert-danger">Error while evaluating javascript input: {error}</div>;
        }
    } else return null;
}
