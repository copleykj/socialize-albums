Template.imageUpload.onRendered(function () {
    var input = this.$('[type=file]');
    var meta = getMeta(input);
    var callback = this.data && this.data.callback;

    // Bind the change handler for the file input.
    input.on('change', function (evt) {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var files = evt.target.files;

            var file;
            for (var i = 0; file = files[i]; i++) {

                // // if the file is not an image, continue
                if (!file.type.match('image.*')) {
                    continue;
                }

                var reader = new FileReader();

                // iife to capture the filename and avoid race condition
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
            alert('File APIs are not fully supported in this browser.');
        }
    });

    Meteor.call('signUpload', function (error, response) {
        if(!error){
            input.cloudinary_fileupload({
                formData: response
            });
        }else{
            throw new Meteor.Error("SigningFailed", "Signing of cloudinary upload failed", error);
        }
    });

    input.on('cloudinarydone', function (e, data) {
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

    });

    input.on('fileuploadprogress', function (event, data) {

        var fileName = data.files[0].name;

        var percentUploaded = ((data.loaded / data.total) * 100).toFixed(0);
        // update the record with progress information
        _cloudinary.update({file_name: fileName}, {$set: {percentUploaded:percentUploaded}});

    });

    input.on('cloudinaryfail', function (error) {
        throw new Meteor.Error("cloudinaryError", "Cloudinary error uploading file. ", error);
    });

});

Template.imageUpload.destroyed = function () {
    var input = this.$('[type=file]');
    input.off("change");
    input.off('cloudinarydone');
    input.off('fileuploadprogress');
    input.off('cloudinaryfail');
};

/* Expects a string "role:profile,albumId:9bx3DsdfDF38Fxldp", returns an object {role:'profile',albumId:'9bx3DsdfDF38Fxldp'}
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
