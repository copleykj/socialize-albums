AlbumsCollection.allow({
    insert: function(userId, album) {
        return album.checkOwnership();
    },
    update: function(userId, album) {
        return album.checkOwnership();
    },
    remove: function(userId, album) {
        return album.checkOwnership();
    }
});

AlbumsCollection.after.remove(function(userId, album){
    PhotosCollection.remove({albumId:this._id});
});
