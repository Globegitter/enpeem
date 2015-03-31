/*eslint-env node, mocha, es6 */
/*eslint indent:1*/

var path 			 	= require('path');
var fs 				 	= require('fs-extra');
var { expect } 	= require('chai');
var tmp        	= require('tmp-sync');
var npm 				= require('../../');

var root       = process.cwd();
var tmproot    = path.join(root, 'tmp');

function getPathToDep(npmModule, customRoot) {
	customRoot = customRoot || path.join('..', '..');

	fs.copySync('package.json', path.join(customRoot, 'package.json'));

	var pathToDep = path.resolve(
		__dirname,
		path.join(customRoot, 'node_modules', npmModule));
	return pathToDep;
}

describe('basic usage', function () {
	var tmpdir;
	var dependency = 'lodash';

	before(function () {
		tmpdir = tmp.in(tmproot);
		this.pathToDep = getPathToDep(dependency, tmpdir);
		process.chdir(tmpdir);
	});

	after(function () {
		process.chdir(root);
    fs.removeSync(tmproot);
	});

	it('should be requirable', function () {
		expect(npm).to.exist; //eslint-disable-line no-unused-expressions
	});

	it('should not crash', async function () {
		try {
			var exitCode = await npm.install({
				dependencies: [dependency],
				production: true,
				loglevel: 'silent'
			});
			expect(exitCode).to.equal(0);
		} catch (error) {
			expect(false, error).to.not.equal(false);
		}
	});

	it('should actually install things', function () {
		//lstatSync checks if a path exists
		try {
			var result = fs.lstatSync(this.pathToDep);
			expect(result).to.be.an('object');
		} catch (error) {
			expect(false, error).to.not.equal(false);
		}
	});


});


describe('with more options', function (){
	var tmpdir;
	var dependency = 'mocha';

	before(function () {
		tmpdir = tmp.in(tmproot);
		this.pathToDep = getPathToDep(dependency, tmpdir);
		process.chdir(tmpdir);
	});

	after(function () {
		process.chdir(root);
    fs.removeSync(tmproot);
	});

  it('should not crash', async function () {
		try {
			var exitCode = await npm.install({
				dependencies: [dependency],
				loglevel: 'silent',
				production: true
				// 'min-cache': 999999999
			});
			expect(exitCode).to.equal(0);
		} catch (error) {
			expect(error, error).to.not.exist; //eslint-disable-line no-unused-expressions
		}
  });

	it('should actually install things', function () {
		try {
			var result = fs.lstatSync(this.pathToDep);
			expect(result).to.be.an('object');
		} catch (error) {
			expect(error, error).to.not.exist; //eslint-disable-line no-unused-expressions
		}
	});
});


describe('with save option', function () {
	var tmpdir;
	var dependency = 'mocha';

	before(function () {
		tmpdir = tmp.in(tmproot);
		this.pathToDep = getPathToDep(dependency, tmpdir);
		this.pathToPackage = path.resolve(
			__dirname, tmpdir, 'package.json'
		);
		process.chdir(tmpdir);
	});

	after(function () {
		process.chdir(root);
		fs.removeSync(tmproot);
	});

	it('should not crash', async function () {
		try {
			var exitCode = await npm.install({
				dependencies: ['mocha'],
				loglevel: 'silent',
				production: false,
				save: true
				// 'min-cache': 999999999
			});
			expect(exitCode).to.equal(0);
		} catch (error) {
			expect(error, error).to.not.exist; //eslint-disable-line no-unused-expressions
		}
	});

	it('should actually install things', function () {
		//require does not work because of caching
		var dependencies = JSON.parse(fs.readFileSync(this.pathToPackage), { encoding: 'utf8'}).dependencies;
		expect(dependencies).to.include.keys('mocha');
		expect(fs.lstatSync(this.pathToDep)).to.be.an('object');
	});
});


describe('with save-dev option', function () {
	var tmpdir;
	var dependency = 'string';

	before(function () {
		tmpdir = tmp.in(tmproot);
		this.pathToDep = getPathToDep(dependency, tmpdir);
		this.pathToPackage = path.resolve(
			__dirname, tmpdir, 'package.json'
		);
		process.chdir(tmpdir);
	});

	after(function () {
		process.chdir(root);
		fs.removeSync(tmproot);
	});

	it('should not crash', async function () {
		try {
			var exitCode = await npm.install({
				dependencies: [dependency],
				loglevel: 'silent',
				production: false,
				saveDev: true
				// 'min-cache': 999999999
			});
			expect(exitCode).to.equal(0);
		} catch (error) {
			expect(error, error).to.not.exist; //eslint-disable-line no-unused-expressions
		}
	});

	it('should actually install things', function () {
		//require does not work because of caching
		var devDependencies = JSON.parse(fs.readFileSync(this.pathToPackage), { encoding: 'utf8'}).devDependencies;
		expect(devDependencies).to.include.keys('string');
		expect(fs.lstatSync(this.pathToDep)).to.be.an('object');
	});
});


describe('with prefix/custom path option', function () {
	var tmpdir;
	var prefixFolder = 'new-folder';
	var dependency = 'string';

	before(function () {
		tmpdir = tmp.in(tmproot);
		// tmpdir = path.join(tmpdir, prefixFolder);
		this.pathToDep = getPathToDep(dependency, path.join(tmpdir, prefixFolder));
		this.pathToPackage = path.resolve(
			__dirname, tmpdir, 'package.json'
		);
		process.chdir(tmpdir);
	});

	after(function () {
		process.chdir(root);
		fs.removeSync(tmproot);
	});

	it('should not crash', async function () {
		try {
			var exitCode = await npm.install({
				dependencies: [dependency],
				loglevel: 'silent',
				production: false,
				prefix: prefixFolder
				// 'min-cache': 999999999
			});
			expect(exitCode).to.equal(0);
		} catch (error) {
			expect(error, error).to.not.exist; //eslint-disable-line no-unused-expressions
		}
	});

	it('should actually install things', function () {
		try {
			var result = fs.lstatSync(this.pathToDep);
			expect(result).to.be.an('object');
		} catch (error) {
			expect(false, error).to.not.equal(false);
		}
	});
});