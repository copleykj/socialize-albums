_cloudinary = new Mongo.Collection(null);


Meteor.startup(function () {
    var publicSettings = Meteor._get(Meteor, "settings", "public");
    if(publicSettings.CLOUDINARY_CLOUD_NAME && publicSettings.CLOUDINARY_API_KEY){
        $.cloudinary.config({
            cloud_name: publicSettings.CLOUDINARY_CLOUD_NAME,
            api_key: publicSettings.CLOUDINARY_API_KEY
        });
    }else{
        throw new Meteor.Error("CloudinarySetupNeeded", "Please configure cloudinary through meteor settings");
    }
});
