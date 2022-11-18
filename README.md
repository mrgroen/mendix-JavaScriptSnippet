## JavaScriptSnippet

Insert custom JavaScript to your Mendix pages, taking object attributes as input parameters.

## Features

Insert JavaScript code which is executed when loading the widget.

Optionally add one or more attributes which can be used inside the JavaScript code.

Optionally for the attribute if it appears to be empty: fill an empty value.

## Usage

Place the widget anywhere (relevant) on the Mendix page. Insert JavaScript code that you want to run there.

Add attribute(s) that you may need inside the code.

Link used attributes inside the JavaScript code by using the `${VariableName}`.

## Issues, suggestions and feature requests

[link to GitHub issues](https://github.com/mrgroen/JavaScript-Snippet/issues)

## Development and contribution

1. Install NPM package dependencies by using: `npm install`. If you use NPM v7.x.x, which can be checked by executing
   `npm -v`, execute: `npm install --legacy-peer-deps`.
1. Run `npm start` to watch for code changes. On every change:
    - the widget will be bundled;
    - the bundle will be included in a `dist` folder in the root directory of the project;
    - the bundle will be included in the `deployment` and `widgets` folder of the Mendix test project.
