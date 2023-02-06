const AWS = require('aws-sdk');
const env = require('../../configs/env');
env.environment();

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_SECRET,
});

module.exports = {
    uploadFileFromURL: function(res, body, fileName) {
        // Check if object exists to see if it should be renamed
        objectExists(fileName).then(function(fileToUpload) {
            console.log('File found on S3: ' + fileToUpload);
            const renamedFile = renameFile(fileToUpload);
            uploadFile(renamedFile);
        }, function() {
            console.log('File not found on S3: ' + fileName);
            uploadFile(fileName);
        });

        /**
         * Upload a file to s3
         */
        function uploadFile(file) {
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: 'files/' + file,
                Body: body,
                ContentType: res.headers['content-type'],
                ContentLength: res.headers['content-length'],
                ACL: 'public-read',
            };

            s3.upload(params, function(err, data) {
                if (err) {
                    console.log(err);
                }
                console.log(`File uploaded successfully to: ${data.Location}`);
            });
        }

    },
    getAwsFileList: function() {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Prefix: 'files/',
        };

        return new Promise(function(resolve, reject) {
            s3.listObjectsV2(params, function(err, data) {
                if (err) {
                    reject(err);
                }

                const items = data.Contents;
                items.sort(function(a, b) {
                    return new Date(b.LastModified) - new Date(a.LastModified);
                });

                const s3Data = {
                    'url': process.env.S3_BASE_URL + '/',
                };

                items.push(s3Data);

                resolve(items);

            });
        });
    },

};

// Head objects to see if file exists
function objectExists(filename) {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: 'files/' + filename,
    };

    return new Promise(function(resolve, reject) {
        s3.headObject(params, function(err) {
            if (err) {
                reject(filename);
            }
            else {
                resolve(filename);
            }
        });
    });
}

// Rename file by prefixing with timestamp
function renameFile(fileName) {
    const filenameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
    const ext = fileName.substr(fileName.lastIndexOf('.') + 1);
    const name = filenameWithoutExtension + '-' + Date.now() + '.' + ext;
    console.log('Renamed file to: ' + name);
    return name;
}