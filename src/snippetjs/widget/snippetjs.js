/*
    JavaScript Snippet
    ===============================

    @file      : snippetjs.js
    @version   : 1.3.1
    @author    : Marcus Groen
    @date      : 10-01-2022
    @copyright : Incentro
    @license   : Apache V2

    Documentation
    ===============================
    This widget can be used to insert custom JavaScript to your page.
*/
define([
    "dojo/_base/declare", "snippetjs/widget/snippetjs_datasource"
], function(declare, _snippetjs) {
    "use strict";
    return declare("snippetjs.widget.snippetjs", [_snippetjs], {
    })
});
require(["snippetjs/widget/snippetjs"], function() {
    "use strict";
});