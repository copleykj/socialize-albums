Photo = CommentableModel.extendAndSetupCollection("photos");

Photo.prototype.url = function (options) {
    if(options){
        options = options.hash || options;
    }else{
        options = {};
    }

    options.default_image = "notFound";

    return $.cloudinary.url(this.publicId, options);
};

PhotosCollection = Photo.collection;


Photo.appendSchema({
    "userId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        autoValue:function () {
            if(this.isInsert || !this.isFromTrustedCode){
                return Meteor.userId();
            }
        },
        denyUpdate:true
    },
    publicId:{
        type:String,
        denyUpdate:true
    },
    "albumId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        optional:true
    },
    "role":{
        type:String,
        optional:true,
        denyUpdate:true
    },
    "date":{
        type:Date,
        autoValue:function() {
            if(this.isInsert || !this.isFromTrustedCode){
                return new Date();
            }
        },
        denyUpdate:true
    },
});

LinkableModel.registerLinkableType(Photo, "photo");
