const path = require("path");
const fs = require("fs");
const util = require("util");

var walkSync = function (dir, filelist) {
	files = fs.readdirSync(dir);
	filelist = filelist || {};
	files.forEach(function (file) {
		if (fs.statSync(dir + file).isDirectory()) {
			filelist = walkSync(dir + file + "/", filelist);
		} else {
			const ext = path.extname(file) !== ".md";
			const basename = path.basename(dir).toUpperCase();
			const newdir = dir.replace(replace, "");
			if (filelist[basename] === undefined) {
				filelist[basename] = {};
			}
			if (ext) {
				filelist[basename][
					file.split(".")[0].toUpperCase().replace(" ", "_")
				] = "./" + newdir + file;
			}
		}
	});
	return filelist;
};

//#region FLAGS
let args = process.argv.slice(2);
/*
 Available flags:
    -dir: directory to search
    -out: store the output file generated
    -file: filename (.ts, .js)
    -log: console logs
 */

let directory;
let output;
let filename;

const dir_index = args.indexOf("-dir");
if (dir_index > -1) {
	directory = args[dir_index + 1];
	if (directory[directory.length - 1] !== "/") {
		directory = directory + "/";
	}
} else {
	//directory = "./";
	throw "source directory was not mentioned";
}
const replace = path.dirname(directory) + "/";
/*
directory = path.resolve(directory);
*/

const out_index = args.indexOf("-out");
if (out_index > -1) {
	output = args[out_index + 1];
} else {
	console.warn(
		"no output directory was found. Files will be generated in the current directory"
	);
	output = "./";
}

const file_index = args.indexOf("-file");
if (file_index > -1) {
	filename = args[file_index + 1];
} else {
	console.warn(
		"no filename was mentioned. By default 'assetpaths.js' file will be created"
	);
	filename = "assetpaths.js";
}

const debuglog_index = args.indexOf("-log");

//#endregion
if (debuglog_index > -1) {
	console.log("directory: " + directory);
	console.log("output: " + output);
	console.log("filename: " + filename);
}

if (fs.existsSync(directory)) {
	let filesList = walkSync(directory);

	if (debuglog_index > -1) {
		console.log("PATHS: ");
		console.log(filesList);
	}
	const message = "export const ASSET_PATHS = ";
	const filepath = path.resolve(output + filename);
	fs.writeFileSync(
		filepath,
		message + util.inspect(filesList, false, 2, false)
	);
}
