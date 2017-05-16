var cordova = require('cordova');

function AppUpdate() {}

/**
 * @param {string} baseUrl          url of the apks distribution service
 * @param {object} loadingStatus    an object that manages apk download progress.
 *                                  it must have setPercentage and increment fucntions.
 * @param {function} callback       function called when the the update is finished
 */
AppUpdate.prototype.update = function (baseUrl, loadingStatus, callback) {
    Promise.all([
        window.cordova.getAppVersion.getPackageName(), 
        window.cordova.getAppVersion.getVersionNumber()
    ]).then(function (values) {
        var package = values[0];
        var version = values[1];
        
        var url = [
            baseUrl,
            package,
            '?version=',
            version
        ].join('');
        
        var fileTransfer = new FileTransfer();
        
        fileTransfer.onprogress = function (progressEvent) {
            if (progressEvent.lengthComputable) {
                loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
            } else {
                loadingStatus.increment();
            }
        };
        
        fileTransfer.download(encodeURI(url),
            'cdvfile://localhost/temporary/app.apk',
            function (entry) {
                cordova.exec(function (success) {
                    window.plugins.webintent.startActivity({
                        action: window.plugins.webintent.ACTION_VIEW,
                        url: entry.toURL(),
                        type: 'application/vnd.android.package-archive'
                    }, function () {
                        // Package Installer stops the app if update succeeds
                    }, function () {
                        console.log("Failed to open URL via Android Intent. URL: " + entry.fullPath);
                        errorCallback && errorCallback(new Error('Failed to open URL via Android Intent.'));
                    });
                }, function (error) {
                    console.log('error setting read permission');
                }, 'AppUpdate', 'setReadable', [entry.toURL()]);
            }, function (error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code" + error.code);
                console.log('no update available. proceed...');
                console.log(JSON.stringify(error));
                if (error.http_status === 409) {
                    callback(null, true);
                } else {
                    callback(error);
                }
            }, true);
    });
};

module.exports = new AppUpdate();
