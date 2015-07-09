//Publish friend records with their related user records
Meteor.publish("albumsFor", function (userId, options) {
    if(!this.userId){
        return this.ready();
    }

    options = options || {};

    //only allow the limit and skip options
    options = _.pick(options, "limit", "skip", "sort");

    Meteor.publishWithRelations({
        handle: this,
        collection: Meteor.albums,
        filter: {userId:userId},
        options:options,
        mappings: [{
            reverse: true,
            key: 'albumId',
            collection: Meteor.photos,
        }]
    });
});
