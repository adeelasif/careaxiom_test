const querystring = require('querystring');
const request = require('request');
const cheerio = require('cheerio');

function parsQueryParams(query) {
  const parsedParams = querystring.parse(query);
  Object.keys(parsedParams).forEach(key => {
    let value = parsedParams[key];
    parsedParams[key] = Array.isArray(value) ? value : value ? [value] : [];
  });
  return parsedParams;
}

function fetchUsingCallbacks(urls, cb) {
  const titles = [];

  urls.forEach((url, index) => {
    request('http://' + url, function(error, response, body) {
      let webpageTitle = 'No Response';

      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(body);
        webpageTitle = $('title').text();
      }

      titles.push(url + ' - ' + webpageTitle);

      if (titles.length == urls.length) {
        cb(null, titles);
      }
    });
  });
}

module.exports = {
  parsQueryParams,
  fetchUsingCallbacks
};