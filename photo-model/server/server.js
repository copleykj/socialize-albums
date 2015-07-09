PhotosCollection.allow({
    insert: function(userId, photo){
        var ownsPhoto = photo.checkOwnership();
        if(photo.albumId){
            var album = AlbumsCollection.findOne(photo.albumId);
            var ownsAlbum = album && album.checkOwnership();

            if(!ownsAlbum){
                //if the the album doesn't exist or the user doesn't own the album
                //remove the albumId and just leave it loose
                delete photo.albumId;
            }
        }
        return ownsPhoto;
    },
    update: function(userId, photo){
        return photo.checkOwnership();
    },
    remove: function(userId, photo) {
        return photo.checkOwnership();
    }
});

PhotosCollection.after.remove(function (userId, photo) {
    if(photo.albumId){
        AlbumsCollection.update(photo.albumId, {$inc:{photoCount:-1}});
    }
    Meteor.defer(function() {
        cloudinary_delete(photo.publicId);
    });
});

PhotosCollection.after.insert(function (userId, photo) {
    if(photo.albumId){
        AlbumsCollection.update(photo.albumId, {$inc:{photoCount:1}});
    }
});
