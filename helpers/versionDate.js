var child_process = require('child_process');

module.exports = {
    versionDate: function(version, file) {
        if (/^v/.test(version)) {
            return new Date(child_process.execSync('cd paper.js\n\
                git log -1 --format=%ai ' + version).toString());
        } else {
            return file.created;
        }
    }
};
