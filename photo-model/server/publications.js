Meteor.publish("photosFor", function(albumId, options){
    if(!this.userId){
        return this.ready();
    }

    options = options || {};

    //only allow the limit and skip options
    options = _.pick(options, "limit", "skip", "sort");

    return PhotosCollection.find({albumId:albumId}, options);
});
