/*global logger*/
/*
    JavaScript Snippet (Data source)
    ================================

    @file      : snippetjs_datasource.js
    @version   : 1.3.1
    @author    : Marcus Groen
    @date      : 10-01-2022
    @copyright : Incentro
    @license   : Apache V2

    Documentation
    =================================
    This widget can be used to insert custom JavaScript to your page, taking object attributes as input parameters.
*/
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "mxui/dom",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dojo/_base/kernel",
    "snippetjs/lib/timeLanguagePack"
], function (declare, _WidgetBase, dom, domConstruct, lang, dojo, languagePack) {
    "use strict";

    return declare("snippetjs.widget.snippetjs_datasource", [_WidgetBase], {
        attributeList: null,
        _contextObj: null,
        _handles: [],
        _timeData: null,
        _timeStrings: {}, // shared
        _init: false,
        _jQuery1: {}, // shared
        _jQuery3: {}, // shared

        postCreate: function () {
            mx.logger.debug(this.id + ".postCreate");
            this._buildTimeStrings();
            this._timeData = languagePack;
            this.attributeList = this.notused;
        },

        _buildTimeStrings: function () {
            if (this._timeStrings.second) {
                return;
            }
            this._timeStrings = {
                "second": this.translateStringsecond,
                "seconds": this.translateStringseconds,
                "minute": this.translateStringminute,
                "minutes": this.translateStringminutes,
                "hour": this.translateStringhour,
                "hours": this.translateStringhours,
                "day": this.translateStringday,
                "days": this.translateStringdays,
                "week": this.translateStringweek,
                "weeks": this.translateStringweeks,
                "month": this.translateStringmonth,
                "months": this.translateStringmonths,
                "year": this.translateStringyear,
                "years": this.translateStringyears,
                "timestampFuture": this.translateStringtimestampFuture,
                "timestampPast": this.translateStringtimestampPast
            };
        },

        update: function (obj, callback) {
            mx.logger.debug(this.id + ".update");
            this._contextObj = obj;
            this._resetSubscriptions();
            this._loadData(callback);
        },

        _evalJS: function (str) {
          var self = this;
          var evalString = "var refresh = " + self._init + "; " + str + "\r\n/* widget = " + self.id + " (snippetjs.js) */";
          mx.logger.debug(self.id + ": eval(\"" + evalString + "\");");
          try {
            // JavaScript evaluation will be done in the context of the widget instance.
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
            (function(str){
                eval(str);
            }).call(self, evalString);
          } catch (e) {
            mx.logger.error(self.id + ": Error while evaluating javascript input.");
            domConstruct.place("<div class=\"alert alert-danger\">Error while evaluating javascript input: " + e + "</div>", self.domNode, "only");
          }
        },

        _loadData: function (callback) {
            var self = this;
            mx.logger.debug(this.id + "._loadData");

            if (this._init === true && this.refresh === false){
                mx.logger.debug(this.id + "._loadData: skipping load because the widget refresh setting is set to false.");
                self._executeCallback(callback, "_loadData");
                return;
            }

            this.replaceattributes = [];
            var referenceAttributeList = [],
                numberlist = [],
                i = null,
                value = null;

            if (this._contextObj && this.attributeList) {
                for (i = 0; i < this.attributeList.length; i++) {
                    if (this._contextObj.get(this.attributeList[i].attrs) !== null) {
                        value = this._fetchAttr(this._contextObj, this.attributeList[i].attrs, this.attributeList[i].renderHTML, i, this.attributeList[i].emptyReplacement, this.attributeList[i].decimalPrecision, this.attributeList[i].groupDigits);
                        if (this.attributeList[i].variablename !== "") {
                        this.replaceattributes.push({
                            id: i,
                            variable: this.attributeList[i].variablename,
                            value: value
                        });
                        } else {
                        mx.logger.warn(this.id + "._loadData: You have an empty variable name, skipping! Please check Data source -> Attributes -> Variable Name");
                        }
                    } else {
                        referenceAttributeList.push(this.attributeList[i]);
                        numberlist.push(i);
                    }
                }
            }

            if (referenceAttributeList.length > 0) {
                //if we have reference attributes, we need to fetch them
                this._fetchReferences(referenceAttributeList, numberlist, callback);
            } else {
                this._runJS(callback);
            }
        },

        // The fetch referencse is an async action, we use dojo.hitch to create a function that has values of the scope of the for each loop we are in at that moment.
        _fetchReferences: function (list, numberlist, callback) {
            mx.logger.debug(this.id + "._fetchReferences");

            var l = list.length;

            var callbackfunction = function (data, obj) {
                mx.logger.debug(this.id + "._fetchReferences get callback");
                var value = this._fetchAttr(obj, data.split[2], data.renderAsHTML, data.oldnumber, data.emptyReplacement, data.decimalPrecision, data.groupDigits);
                this.replaceattributes.push({
                    id: data.i,
                    variable: data.listObj.variablename,
                    value: value
                });

                l--;
                if (l <= 0) {
                    this._runJS(callback);
                } else {
                    this._runJS();
                }
            };

            for (var i=0; i < list.length; i++) {
                var listObj = list[i],
                    split = list[i].attrs.split("/"),
                    guid = this._contextObj.getReference(split[0]),
                    renderAsHTML = list[i].renderHTML,
                    emptyReplacement = list[i].emptyReplacement,
                    decimalPrecision = list[i].decimalPrecision,
                    groupDigits = list[i].groupDigits,
                    oldnumber = numberlist[i],
                    dataparam = {
                        i: i,
                        listObj: listObj,
                        split: split,
                        renderAsHTML: renderAsHTML,
                        emptyReplacement: emptyReplacement,
                        decimalPrecision: decimalPrecision,
                        groupDigits: groupDigits,
                        oldnumber: oldnumber
                    };

                if (guid !== "") {
                    mx.data.get({
                        guid: guid,
                        callback: lang.hitch(this, callbackfunction, dataparam)
                    });
                } else {
                    //empty reference
                    this.replaceattributes.push({
                        id: i,
                        variable: listObj.variablename,
                        value: ""
                    });
                    this._runJS(callback);
                }
            }
        },

        _fetchAttr: function (obj, attr, renderAsHTML, i, emptyReplacement, decimalPrecision, groupDigits) {
            mx.logger.debug(this.id + "._fetchAttr");
            var returnvalue = "",
                options = {},
                numberOptions = null;

             // Referenced object might be empty, can't fetch an attr on empty
            if (!obj) {
                return emptyReplacement;
            }

            if (obj.isDate(attr)) {
                if (this.attributeList[i].datePattern !== "") {
                    options.datePattern = this.attributeList[i].datePattern;
                }
                if (this.attributeList[i].timePattern !== "") {
                    options.timePattern = this.attributeList[i].timePattern;
                }
                returnvalue = this._parseDate(this.attributeList[i].datetimeformat, options, obj.get(attr));
            } else if (obj.isEnum(attr)) {
                returnvalue = this._checkString(obj.getEnumCaption(attr, obj.get(attr)), renderAsHTML);

            } else if (obj.isNumeric(attr) || obj.getAttributeType(attr) === "AutoNumber") {
                numberOptions = {};
                numberOptions.places = decimalPrecision;
                if (groupDigits) {
                    numberOptions.locale = dojo.locale;
                    numberOptions.groups = true;
                }

                returnvalue = mx.parser.formatValue(obj.get(attr), obj.getAttributeType(attr), numberOptions);
            } else {
                if (obj.getAttributeType(attr) === "String") {
                    returnvalue = this._checkString(mx.parser.formatAttribute(obj, attr), renderAsHTML);
                }
            }
            if (returnvalue === "") {
                return emptyReplacement;
            } else {
                return returnvalue;
            }
        },

        _runJS: function (callback) {
            var self = this;
            mx.logger.debug(self.id + "._runJS");
            var str = self.snippet,
                settings = null,
                attr = null;
            for (attr in self.replaceattributes) {
                settings = self.replaceattributes[attr];
                str = str.split("${" + settings.variable + "}").join(settings.value);
            }
            /*
                jQuery is a library that uses define (AMD style),
                but is using an explicit identifier, "jquery".
                I removed this identifier in the source so it will
                define itself as the path of the file and
                multiple versions can be loaded.
            */
            if (self.usejQuery === "jQuery1") {
                define.amd.jQuery = true;
                require(["snippetjs/lib/jquery-1.12.4"], function (jquery1124) {
                    self._jQuery1 = jquery1124;
                    str = "var jQuery, $; jQuery = $ = self._jQuery1; " + str;
                    self._evalJS(str);
                });
            } else if (self.usejQuery === "jQuery3") {
                define.amd.jQuery = true;
                require(["snippetjs/lib/jquery-3.1.1"], function (jquery311) {
                    self._jQuery3 = jquery311;
                    str = "var jQuery, $; jQuery = $ = self._jQuery3; " + str;
                    self._evalJS(str);
                });
            } else {
                self._evalJS(str);
            }
            self._executeCallback(callback, "_runJS");
        },

        _checkString: function (string, renderAsHTML) {
            mx.logger.debug(this.id + "._checkString");
            if (string.indexOf("<script") > -1 || !renderAsHTML) {
                string = dom.escapeString(string);
            }
            return string;
        },

        _parseDate: function (format, options, value) {
            mx.logger.debug(this.id + "._parseDate");
            var datevalue = value;

            if (value === "") {
                return value;
            }

            if (format === "relative") {
                return this._parseTimeAgo(value);
            } else {
                options.selector = format;
                datevalue = dojo.date.locale.format(new Date(value), options);
            }
            return datevalue;
        },

        _parseTimeAgo: function (value, data) {
            mx.logger.debug(this.id + "._parseTimeAgo");
            var date = new Date(value),
                now = new Date(),
                appendStr = null,
                diff = Math.abs(now.getTime() - date.getTime()),
                seconds = Math.floor(diff / 1000),
                minutes = Math.floor(seconds / 60),
                hours = Math.floor(minutes / 60),
                days = Math.floor(hours / 24),
                weeks = Math.floor(days / 7),
                months = Math.floor(days / 31),
                years = Math.floor(months / 12),
                time = null;

            if (this.useTranslatableStrings) {
                time = this._timeStrings;
            } else {
                time = this._timeData[dojo.locale];
            }

            appendStr = (date > now) ? time.timestampFuture : time.timestampPast;

            function createTimeAgoString(nr, unitSingular, unitPlural) {
                return nr + " " + (nr === 1 ? unitSingular : unitPlural) + " " + appendStr;
            }

            if (seconds < 60) {
                return createTimeAgoString(seconds, time.second, time.seconds);
            } else if (minutes < 60) {
                return createTimeAgoString(minutes, time.minute, time.minutes);
            } else if (hours < 24) {
                return createTimeAgoString(hours, time.hour, time.hours);
            } else if (days < 7) {
                return createTimeAgoString(days, time.day, time.days);
            } else if (weeks < 5) {
                return createTimeAgoString(weeks, time.week, time.weeks);
            } else if (months < 12) {
                return createTimeAgoString(months, time.month, time.months);
            } else if (years < 10) {
                return createTimeAgoString(years, time.year, time.years);
            } else {
                return "a long time " + appendStr;
            }
        },

        _resetSubscriptions: function () {
            mx.logger.debug(this.id + "._resetSubscriptions");
            // Release handle on previous object, if any.
            var i = 0;

            for (i = 0; i < this._handles.length; i++) {
                if (this._handles[i]) {
                    this.unsubscribe(this._handles[i]);
                    this._handles[i] = null;
                }
            }

            if (this._contextObj) {
                this._handles[0] = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: this._loadData
                });
                if (this.attributeList) {
                    for (i = 0; i < this.attributeList.length; i++) {
                        this._handles[i + 1] = this.subscribe({
                            guid: this._contextObj.getGuid(),
                            attr: this.attributeList[i].attrs,
                            callback: this._loadData
                        });
                    }
                }
            }
        },

        _executeCallback: function (cb, from) {
          mx.logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
          this._init = true;
          if (cb && typeof cb === "function") {
            cb();
          }
        }
    });
});
require(["snippetjs/widget/snippetjs_datasource"]);
