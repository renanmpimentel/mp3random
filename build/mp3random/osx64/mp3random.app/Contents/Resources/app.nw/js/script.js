/**
 * http://tutorialzine.com/2015/01/your-first-node-webkit-app/
 * 
 * Comando para iniciar aplicação
 * $ nwbuild -r nwapp
 * 
 */

var fs = require('fs');
var path = require("path");
var recursive = require('recursive-readdir');
var shuffle = require('shuffle-array');

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename);
    var megabytes = stats["size"];
    return megabytes  / 1000000.0;
}

function readdir(from, to, megabytes) {
    var mp3s = [];
    var bytes = 0;
    var total = 0;
    var p = $('form p');
    recursive(from, function (err, files) {
        shuffle(files);
        files.forEach(function (file) {
            if (file.endsWith('.mp3')) {
                mp3s.push(file);
            }
        });
        shuffle(mp3s);
        mp3s.forEach(function (item) {
            var filename = to + '/' + path.basename(item);
            if (!fs.existsSync(to)) {
                fs.mkdirSync(to);
            }
            bytes += getFilesizeInBytes(item);
            if (bytes <= megabytes && !fs.existsSync(filename)) {
                fs.createReadStream(item).pipe(fs.createWriteStream(filename));
                p.html(path.basename(item));
                total++;
            }
        });
        p.html(total + ' items added');
    });
}

$(function () {
    $('button').click(function () {
        var from = $('input[name="from"]').val();
        var to = $('input[name="to"]').val();
        var megabytes = $('input[name="megabytes"]').val();
        readdir(from, to, megabytes);
    });
});