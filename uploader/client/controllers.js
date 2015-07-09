Template.c_clientside_upload.rendered = function () {
    var input = this.$('[type=file]');
    var meta = getMeta(input);
    var callback = this.data && this.data.callback;

    // Bind the change handler for the file input.
    input.bind('change', function (evt) {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var files = evt.target.files;

            var file;
            for (var i = 0; file = files[i]; i++) {

                // // if the file is not an image, continue
                if (!file.type.match('image.*')) {
                    continue;
                }

                var reader = new FileReader();

                // immediate function to capture the filename and avoid race condition
                reader.onload = (function (fileRead) {
                    var fileName = fileRead.name; // get the name of file to use as annotation

                    return function () {
                        var pendingFile = {
                            file_name: fileName,
                            created_at: new Date(),
                            uploading: true,
                            previewData: this.result
                        };

                        if (!$.isEmptyObject(meta)) {
                            _.extend(pendingFile, meta);
                        }

                        _cloudinary.insert(pendingFile);
                    };

                }(file));

                reader.readAsDataURL(file);
            }
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    });

    var preset = getPreset(input);
    var cloudinaryUploadParams = getCloudinaryOptions(input);

    // Set up an unsigned upload
    input.unsigned_cloudinary_upload(preset, cloudinaryUploadParams).bind('cloudinarydone', function (e, data) {
        var fileName = data.files[0].name; // get the name of the file
        var result = data.result; // get the result from cloudinary

        // get the record have a copy of previewData encoded image
        var record = _cloudinary.findOne({file_name: fileName});

        if (!record) {
            throw new Meteor.Error("fileNotFound", "Error in cloudinarydone handler. Did not find " + fileName);
        }

        // update the record with the result
        _cloudinary.update({file_name: fileName,}, {$set:{percentUploaded:100,uploading:false}});

        _.extend(result, meta);

        result.publicId = result.public_id;

        var photoId = new Photo(result).save();

        if(callback){
            Meteor.call(callback, Meteor.photos.findOne(photoId));
        }

    }).bind('fileuploadprogress', function (event, data) {

        var fileName = data.files[0].name;

        var percentUploaded = ((data.loaded / data.total) * 100).toFixed(0);
        // update the record with progress information
        _cloudinary.update({file_name: fileName}, {$set: {percentUploaded:percentUploaded}});

    }).bind('cloudinaryfail', function (e) {
        throw new Meteor.Error("cloudinaryError", "Cloudinary error uploading file. " + e.message);
    });
};

Template.c_clientside_upload.destroyed = function () {
    var input = this.$('[type=file]');
    input.unbind("cloudinarystop");
    input.unbind('cloudinarystart');
    input.unbind('cloudinaryprogress');
    input.unbind('cloudinarydone');
};

/* Expects a string "role:collector,userId:1234,...", return and object {role:'collector',userId:'1234'}
 */
var getMeta = function ($input) {
    var meta = {};
    var metaField = $input.data('meta');

    if (metaField && metaField.length > 0) {
        var keyValues = metaField.split(',');
        _.map(keyValues, function (keyValue) {
            var pair = keyValue.split(":");
            meta[pair[0]] = pair[1];
        });
    }

    return meta;
};

var getPreset = function ($input) {
    var preset = $input.data("preset");
    if (preset) {
        return preset;
    }
};

var getCloudinaryOptions = function($input) {
    var options = {};

    var tags = $input.data("tags");

    if (tags) {
        options.tags = tags;
    }

    var context = {}; // $input.data("context")|| {};
    // if debugging add an extra tag
    if ($.cloudinary.config().debug) {
        context = {alt: 'debug'};
    }
    if (context) {
        options.context = context;
    }

    var publicId = $input.data('publicId');
    if (publicId) {
        options.public_id = publicId;
    }

    // var folder = $input.data('folder');
    // if(folder){
    // 	options.folder = folder;
    // }
    return options;
};
