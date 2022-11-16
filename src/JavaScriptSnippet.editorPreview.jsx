import { createElement } from "react";

export function preview({ jsCode }) {
    return (
        <div className="javascript-snippet-preview">
            <div className="javascript-snippet-preview__icon">
                <svg width="40" height="40">
                    <path
                        fill="#fe5000"
                        d="M32,20l-5.66,5.66-1.41-1.41,4.24-4.24-4.24-4.24,1.41-1.41,5.66,5.66Zm-21.17,0l4.24,4.24-1.41,1.41-5.66-5.66,5.66-5.66,1.41,1.41-4.24,4.24Zm6.96,9h-2.13l6.55-18h2.13l-6.55,18Z"
                    />
                </svg>
            </div>
            <p className="javascript-snippet-preview__text">
                <span>JavaScript Snippet</span>
                <span className="javascript-snippet-preview__text--smaller">{jsCode}</span>
            </p>
        </div>
    );
}

export function getPreviewCss() {
    return require("./ui/JavaScriptSnippet.css");
}
