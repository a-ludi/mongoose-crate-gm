var should = require("should"),
	crypto = require("crypto"),
	os = require("os"),
	fs = require("fs"),
	path = require("path"),
	sinon = require("sinon"),
	ImageMagick = require("../lib/ImageMagick");

function randomString(length) {
	return crypto.randomBytes(Math.ceil(length/2))
		.toString("hex")
		.slice(0, length);
}

describe("ImageMagick", function() {

	it("should object strenuously if options are not specified", function(done) {
		(function() {
			new ImageMagick();
		}).should.throw();

		done();
	})

	it("should process a png", function(done) {
		var processor = new ImageMagick({
			transforms: {
				original: {

				}
			}
		});

		var file = path.resolve(__dirname + "/./fixtures/node_js_logo.png");
		var storageProvider = {
			save: sinon.stub()
		};
		storageProvider.save.callsArgWith(1, null, "http://foo.bar");

		var model = {
			id: "model_id",
			original: {}
		};

		processor.process({
			path: file,
			mimeType: "image/png"
		}, storageProvider, model, function(error) {
			should(error).not.ok;

			// should have populated meta data
			model.original.should.be.ok;
			model.original.depth.should.equal(8);
			model.original.format.should.equal("PNG");
			model.original.height.should.equal(196);
			model.original.mimeType.should.equal("image/png");
			model.original.name.should.equal("node_js_logo.png");
			model.original.size.should.equal(19401);
			model.original.url.should.equal("http://foo.bar");
			model.original.width.should.equal(574);

			done();
		});
	})

	it("should not process text file", function(done) {
		var processor = new ImageMagick({
			transforms: {
				original: {

				}
			}
		});
		var file = path.resolve(__dirname + "/./fixtures/foo.txt");

		processor.process(file, null, null, function(error) {
			should(error).ok;

			done();
		});
	})

	it("should extend field schema", function(done) {
		var processor = new ImageMagick({
			transforms: {
				original: {

				}
			}
		});

		var schema = processor.createFieldSchema();
		schema.original.format.should.equal(String);
		schema.original.depth.should.equal(String);
		schema.original.width.should.equal(Number);
		schema.original.height.should.equal(Number);

		done();
	})
})
