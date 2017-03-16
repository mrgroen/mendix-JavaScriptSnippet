/*
    JavaScript Snippet
    ===============================

    @file      : snippetjs.js
    @version   : 1.2.0
    @author    : Marcus Groen
    @date      : 16-03-2017
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