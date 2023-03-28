var request = require("request");
var fs = require("fs");
var download = require('image-downloader');
var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });

exports.saveFacebookImageUrl = function(url,imgname,callback) {
    request(url, function(err, res, body) {
        var data = JSON.parse(body)
        options = {
            url: data.data.url,
            dest: __basedir +'/media/images/user/'+imgname+'.jpg'      // will be saved to /path/to/dest/photo.jpg
          }
          download.image(options)
          .then(({ filename }) => {
            callback("success")
          });
    });

}

exports.saveImageUrl = function(url,imgname,callback) {
    var options = {
        url: url,
        dest: __basedir +'/media/images/user/'+imgname+'.jpg'      // will be saved to /path/to/dest/photo.jpg
      }
      download.image(options)
      .then(({ filename }) => {
        callback("success")
      });
}

exports.uploadImage = function (req,res) {
  console.log(req);
  res.json({
    status: true,
    message: 'image upload successfully completed'
  })
}

exports.uploadMedia = async function(req,res) {
  var data = fs.readFileSync(req.file.path);
  try {
    ipfs.add(data, function (err, file) {
      if(err) {
        console.log(err);
        res.json({
          status: false,
          message: 'media upload failed',
          data:  ''
        })
      } else {
        res.json({
          status: true,
          message: 'media upload successfully completed',
          data:  file[0].hash
        })
      }
    })
  } catch (err) {
    console.log(err);
    res.json({
      status: false,
      message: 'media upload failed',
      data:  ''
    })
  }
}