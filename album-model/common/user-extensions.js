User.prototype.albums = function (limit, skip, sortBy, sortOrder) {
    var options = {};
    var sort = {};

    if(limit){
        options.limit = limit;
    }

    if(skip){
        options.skip = skip;
    }

    if(sortBy && sortOrder){
        sort[sortBy] = sortOrder;
        options.sort = sort;
    }

    return Meteor.albums.find({userId:this._id});
};
