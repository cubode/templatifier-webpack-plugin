# templatifier-webpack-plugin

**TemplatifierWebpackPlugin** is a custom Webpack plugin designed to transform your **HTML templates** by replacing specific comment markers with **Django** template tags. This plugin is particularly useful if you're working with Django templates and static files, allowing you to automate the injection of {% load static %}, {% csrf_token %}, and static file routes into your HTML files.

## Installation
You can install this plugin via npm:

```bash
npm install templatifier-webpack-plugin --save-dev
```

## Usage

Basic Configuration

To use the TemplatifierWebpackPlugin, add it to the plugins section of your Webpack configuration file. You can specify the inputFile option to point to the HTML file you want to process and the outputDirectory option to specify where the transformed file should be saved.

Here’s an example configuration:

```javascript

const TemplatifierWebpackPlugin = require('templatifier-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // Your other Webpack configuration settings
    plugins: [
        new TemplatifierWebpackPlugin({
            inputFile: './src/html/index.html',
            outputDirectory: 'prod'
        }),
        new TemplatifierWebpackPlugin({
            inputFile: './src/html/login.html',
            outputDirectory: 'prod'
        }),
        new TemplatifierWebpackPlugin({
            inputFile: './src/html/register.html',
            outputDirectory: 'prod'
        }),
        new TemplatifierWebpackPlugin({
            inputFile: './src/html/reset_password.html',
            outputDirectory: 'prod'
        }),
        new TemplatifierWebpackPlugin({
            inputFile: './src/html/reset_password_confirm.html',
            outputDirectory: 'prod'
        }),
          
        new HtmlWebpackPlugin({
            template: './src/html/prod/index.html',
            filename: 'html/index.html',
            chunks: ['index'],
            inject: false,
        }),
    ]
};
```

### Options

- inputFile: (string) The path to the input HTML file that should be processed. Default: 'src/template.html'.
- outputDirectory: (string) The directory where the transformed HTML file will be saved. This path is relative to the directory containing the inputFile. Default: 'templatifier'.
- writeOriginal: (boolean|string) If set to true, the plugin will overwrite the original input file with the transformed HTML. Default: false.

### HTML Template Directives

The plugin processes the following custom comment markers in your HTML:

Load Static:

```html
<!-- <cb-templatifier type="loadstatic" /> -->
```

This will inject {% load static %} at the top of your HTML file.

Static CSS:

```html
<!-- <cb-templatifier type="static-css" route="path/to/your/style.css" /> -->
```

This will replace the comment with:

```html
<link href="{% static 'path/to/your/style.css' %}" rel="stylesheet">
```

Static Script:

```html
<!-- <cb-templatifier type="static-script" route="path/to/your/script.js" /> -->
```

This will replace the comment with:

```html
<script defer="defer" src="{% static 'path/to/your/script.js' %}"></script>
```

CSRF Token:

```html
<!-- <cb-templatifier type="csrf_token" /> -->
```

This will replace the comment with:

```html
{% csrf_token %}
```

### Example Usage Scenario

If you're working on a Django project and need to ensure that all your HTML files in the src/html/ directory have the appropriate Django template tags, you can use TemplatifierWebpackPlugin to automate this process.

Consider the following file structure:

```css
├── src
│   ├── html
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── reset_password.html
│   │   └── reset_password_confirm.html
```

You can configure multiple instances of the TemplatifierWebpackPlugin to process each file individually, and the processed files will be saved in the prod/ directory within src/html/.

## License
This plugin is licensed under the MIT License. See the LICENSE file for details.

## Contributing
Feel free to contribute by submitting issues or pull requests to the repository. Contributions are welcome!

## Support
For any issues or questions, please open an issue on the GitHub repository.

## About
We are www.cubode.com an startup focussed on No Code, AI and OpenSouce.

Templatifier-webpack-plugin has been developed with 💙 for the community, check Templatifier (https://www.npmjs.com/package/templatifier & https://github.com/cubode/templatifier) 