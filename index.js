const fs = require('fs');
const path = require('path');

class TemplatifierWebpackPlugin {
    constructor(options = {}) {
        this.inputFile = options.inputFile || 'src/template.html';
        this.outputDirectory = options.outputDirectory || 'templatifier';
        this.writeOriginal = options.writeOriginal || false;
    }

    apply(compiler) {
        compiler.hooks.beforeCompile.tapAsync('TemplatifierWebpackPlugin', (params, callback) => {
            const absoluteInputPath = path.resolve(compiler.context, this.inputFile);
            const inputDir = path.dirname(absoluteInputPath);
            const inputFileName = path.basename(absoluteInputPath);
            const templatifierDir = path.join(inputDir, this.outputDirectory);
            const absoluteOutputPath = path.join(templatifierDir, inputFileName);

            // Ensure templatifier directory exists
            fs.mkdirSync(templatifierDir, { recursive: true });

            // Read the input HTML file
            let html = fs.readFileSync(absoluteInputPath, 'utf8');

            // Initialize pre-html content with `{% load static %}` if necessary
            let preHtmlContent = '';

            // Process the <cb-templatifier> elements by replacing them manually using comments
            html = html.replace(/<!--\s*<cb-templatifier type="loadstatic" \/>\s*-->/g, () => {
                preHtmlContent += '{% load static %}\n';
                return ''; // Remove the comment from HTML
            });

            html = html.replace(/<!--\s*<cb-templatifier type="static-css" route="([^"]+)" \/>\s*-->/g, (match, route) => {
                return `<link href="{% static '${route}' %}" rel="stylesheet">`;
            });

            html = html.replace(/<!--\s*<cb-templatifier type="static-script" route="([^"]+)" \/>\s*-->/g, (match, route) => {
                return `<script defer="defer" src="{% static '${route}' %}"></script>`;
            });

            html = html.replace(/<!--\s*<cb-templatifier type="csrf_token" \/>\s*-->/g, () => {
                return '{% csrf_token %}';
            });

            // Prepend the pre-html content (like `{% load static %}`) to the final HTML
            const outputHtml = preHtmlContent + html;
            
            if (this.writeOriginal === true || this.writeOriginal === 'true') {
                // Write the transformed HTML back to the original file
                fs.writeFileSync(absoluteInputPath, outputHtml, 'utf8');
            }
            // Create a copy of the transformed HTML in the templatifier subfolder
            fs.writeFileSync(absoluteOutputPath, outputHtml, 'utf8');

            callback();
        });
    }
}

module.exports = TemplatifierWebpackPlugin;