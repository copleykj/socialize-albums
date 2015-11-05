Cloudinary = Npm.require("cloudinary");
var Future = Npm.require('fibers/future');

var settings = Meteor._get(Meteor, "settings");

if(settings.CLOUDINARY_API_SECRET){
    Cloudinary.config({
        cloud_name: settings.public.CLOUDINARY_CLOUD_NAME,
        api_key: settings.public.CLOUDINARY_API_KEY,
        api_secret: settings.CLOUDINARY_API_SECRET
    });
}else{
    throw new Meteor.Error("CloudinarySetupNeeded", "Please configure cloudinary through meteor settings");
}

cloudinary_delete = function(public_id){
    var future = new Future();
    var ids;

    ids = [public_id];

    Cloudinary.api.delete_resources(ids,function(result){
        future.return(result);
    });

    return future.wait();
};

Meteor.methods({
    "signUpload": function() {
        var params = {timestamp: new Date().getTime()};

        return Cloudinary.utils.sign_request(params);
    }
});
