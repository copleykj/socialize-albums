Album = BaseModel.extendAndSetupCollection("albums");

Album.methods({
    user: function(){
        return Meteor.users.findOne(this.userId);
    },

    photos: function(){
        return PhotosCollection.find({albumId:this._id});
    },

    cover: function(options){
        var coverImage = PhotosCollection.findOne({'albumId':this._id}, {sort:{date:-1}});

        if(coverImage){
            return coverImage.url(options);
        }else{
            return new Photo({publicId:Album.defaultAlbumCover}).url(options);
        }
    },

    setPrivacyLevel: function(level) {
        this.update({$set:{privacy:level}});
    }
});

AlbumsCollection = Album.collection;

Album.appendSchema({
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
    "date":{
        type:Date,
        autoValue:function() {
            if(this.isInsert || !this.isFromTrustedCode){
                return new Date();
            }
        },
        denyUpdate:true
    },
    albumName:{
        type:String,
        max:50
    },
    "type":{
        type:String,
        defaultValue: "standard"
    },
    privacy:{
        type:Number,
        defaultValue:0
    },
    photoCount:{
        type:Number,
        defaultValue:0
    }
});
