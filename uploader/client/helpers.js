Template.registerHelper('uploader', function () {
    return {
        images: function() {
            return _cloudinary.find({uploading: true});
        }
    };
});
