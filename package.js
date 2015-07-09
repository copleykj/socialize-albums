Package.describe({
    name: "socialize:albums",
    summary: "A package for impmementing social network style photo albums",
    version: "0.1.0",
});

Package.onUse(function(api) {
    api.versionsFrom("1.0.2.1");

    Npm.depends({
        cloudinary: "1.2.1",
    });

    api.use([
        "socialize:user-model@0.1.4", "socialize:commentable@0.1.0"
    ]);

    api.imply("socialize:user-model");

    api.use(["templating", "base64"], "client");

    api.addFiles([
        "uploader/lib/jquery.iframe-transport.js", "uploader/lib/jquery.ui.widget.js", "uploader/lib/jquery.fileupload.js",
        "uploader/lib/jquery.cloudinary.js"
    ], "client");

    api.addFiles([
        "uploader/client/blocks.html", "uploader/client/helpers.js", "uploader/client/controllers.js",
                 "uploader/client/collections.js"
    ], "client");

    api.addFiles("uploader/server/server.js", "server");

    //Add the post-model files
    api.addFiles(["album-model/common/album-model.js", "album-model/common/user-extensions.js"]);
    api.addFiles(["album-model/server/server.js", "album-model/server/publications.js"], "server");

    api.addFiles(["photo-model/common/photo-model.js"]);
    api.addFiles(["photo-model/server/server.js", "photo-model/server/publications.js"], "server");

    api.export(["Album", "Photo"]);
    api.export("Cloudinary", 'server');
    api.export("_cloudinary", "client");
});
