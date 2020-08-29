var fs = require('fs');
var UglifyJS = require('uglify-es');

function minify() {
    uglifySettings = {
        warnings: true,
        mangle: true,
        compress: {
            sequences: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            drop_console: true
        }
    };
    var result = UglifyJS.minify(
        {
            "gamepadInput.js": fs.readFileSync("./src/gamepadInput.js", "utf8"),
        },
        uglifySettings
    );

    console.log(result.warnings);
    if (result.error) {
        console.log(result.error);
    }
    else {
        fs.writeFileSync('./dist/gamepadInput.min.js', result.code);
    }
}

minify();