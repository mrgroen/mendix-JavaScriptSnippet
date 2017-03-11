# JavaScript Snippet
This widget adds custom JavaScript to your Mendix pages, taking object attributes as input parameters. 

## Typical usage scenario
When styling the frontend of your application you want to be in control. This widget enables you to execute custom JavaScript with multiple object attributes as input. Allowing you to take control again while using dynamically loaded content from Mendix. The snippet is executed when the dataview is done loading, which prevents nasty "setTimeout" scripts.

## Installation
Import the widget to your project and add 'JavaScript Snippet' to a dataview (or listview) on a page. Configure the properties to determine how the widget will behave in your application.

## Features and limitations
- The snippet is executed when the dataview is done loading.
- Supports multiple attributes for input. (optional)
- Attributes can be retrieved one level deep.
- Setting the same attribute multiple times using different date/time formatting is not supported.
- Control if your snippet needs to run again if the object is refreshed. This can be done by using the "Enable refresh" property of the widget. Or you can use the build-in local boolean variable "refresh" to determine if a refresh is done and use it with your own logic.
- Supports multiple jQuery versions in the same application. (dynamically loaded)
- jQuery extensions and plugins are not supported by design. But it should be possible to use custom JavaScript to load them on your own. If you really need extensive jQuery functionality it would be wise to add all the jQuery libraries, extensions and plugins in your theme package and disable jQuery in this widget so you can use the global variables.

## Properties
* *Enable jQuery* - If you want to use jQuery in your snippet.
* *Enable refresh* - Run your snippet again if the object is refreshed.
* *JavaScript Snippet* - Use ${your_variable_name} to have the attribute value inserted in this content. Note that this content, except for the replacements, is interpreted as JavaScript.
* *Empty value replacement* - This string will be used when an attribute returns empty. Note that this string is interpreted as JavaScript.
* *Attributes* - The list of attributes and their indentifiers to be used in the *JavaScript Snippet* property of this widget.
* *Date format* - Shows date and/or time according to locale of user. Relative is time relative to current datetime. (E.g. 3 hours from now)
* *Date pattern* - Optional, date pattern to override date part according to dojo/date/locale. (e.g `MMMM d, 'in the year' yyyy GGGG`)
* *Time pattern* - Optional, time pattern to override time part according to dojo/date/locale. (e.g `h:m:s.SSS a z`)
* *Render value as HTML* - Escapes string value when set to false.
* *Decimal Precision* - The number of decimals to display.
* *Group Digits* - Displays separator character in case of a number datatype.

## Contributing
For more information on contributing to this repository visit [Contributing to a GitHub repository] (https://docs.mendix.com/howto7/contribute-to-a-github-repository)
