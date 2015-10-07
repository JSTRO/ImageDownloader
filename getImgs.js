
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var mkdirp = require('mkdirp');
var inputUrl = process.argv[2];

function getUrl(url, callback) {
  request({
    url: inputUrl
  }, function(err, response, body) {
    if (err) {
      callback(err, null)
    } else {
      $ = cheerio.load(body);
        var imgUrls = $('img').map(function(index, element) {
          return $(this).attr('src');
        }).get().map(function (url) {     
            if (url.substring(0, 2) === '//') {
              return 'http:' + url;
            } else if (url.substring(0, 1) === '/') {
              return 'http:/' + url;
            } else {
              return url;              
            } 
          }) 
        console.log(imgUrls);

        for (var i=0; i<imgUrls.length; i++) {
          var splitImg = imgUrls[i].split('/');

          mkdirp('/wiki', function (err) {
            if (err) console.error(err)
            else console.log('directory created')
          });

          var fileName = splitImg[splitImg.length - 1];

          request(inputUrl).pipe(fs.createWriteStream(fileName));
        }
    }
  })
};

getUrl();

