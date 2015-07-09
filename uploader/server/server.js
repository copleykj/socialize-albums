Cloudinary = Npm.require("cloudinary");
var Future = Npm.require('fibers/future');

cloudinary_delete = function(public_id){
    var future = new Future();
    var ids;

    ids = [public_id];

    Cloudinary.api.delete_resources(ids,function(result){
        future.return(result);
    });

    return future.wait();
};
