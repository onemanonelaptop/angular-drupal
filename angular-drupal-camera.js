angular.module('angular.drupal.camera', [])

.factory('camera', function() {
    // Stop the function crapping out if there is no camera in the browser
    if (typeof(Camera) == 'undefined') {
        Camera = {
            DestinationType: {
                DATA_URL: {

                }
            }
        }
    }

    var self = {
        options: {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: 1,
            encodingType: 0, // 0=JPG 1=PNG
            correctOrientation: true, // rotate portraits correctly
            resize: false,
            width: 0
        },

        resizePicture: function(imgData, options, resizeSuccess, resizeFailure) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext("2d");

            var img = new Image();
            img.onload = function() {
                canvas.width = options.width;
                canvas.height = canvas.width * (img.height / img.width);
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                resizeSuccess(canvas.toDataURL());
            }

            if (options.encodingType == 0) {
                img.src = "data:image/jpeg;base64," + imgData;
            } else {
                img.src = "data:image/png;base64," + imgData;
            }

        },

        getPicture: function(options, pictureSuccess, pictureFail) {
            var options = angular.extend({}, self.options, options);

            // Take picture using device camera and retrieve image as base64-encoded string
            navigator.camera.getPicture(function(imageData) {
                if (options.resize) {

                    self.resizePicture(imageData, options, function(resizedImage) {
                        pictureSuccess(resizedImage);
                    }, function() {});
                } else {

                    if (options.encodingType == 0) {
                        imageData = "data:image/jpeg;base64," + imageData;
                    } else {
                        imageData = "data:image/png;base64," + imageData;
                    }

                    pictureSuccess(imageData);
                }
            }, function() {
                if (typeof(pictureFail) == 'function') {
                    pictureFail();
                }
            }, options);

        }
    }

    return self;
})