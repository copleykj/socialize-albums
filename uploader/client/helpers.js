Template.registerHelper('uploader', function () {
    return {
        uploading_images: function() {
            return _cloudinary.find({uploading: true});
        },
        url: function(publicId, options) {
            return publicId && $.cloudinary.url(publicId, options.hash);
        }
    };
});
