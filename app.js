const fs = require('fs');
const json2csv = require('json2csv');
const Twit = require('twit');
const config = require('./conf.js');
const T = new Twit(config);

const stream = T.stream('statuses/filter', { track: 'rsd17' }) // Change the word inside '' for the one you want to search ;)

stream.on('tweet', function (tweet) {
  const date = tweet.created_at;
  const text = (tweet.text).replace(/(\r\n|\n|\r)/gm,"");
  const user = tweet.user.screen_name;
  const location = tweet.user.location;
  let user_description;
  if (user_description !== undefined) {
    user_description = (tweet.user.description).replace(/(\r\n|\n|\r)/gm,"");
  }
  const followers = tweet.user.followers_count;
  const coordinates = tweet.coordinates;
  const max = tweet.max_id_str;
  let place;
  if (tweet.place != null) {
    place = tweet.place.full_name + ',' + tweet.place.country;
  }

  let obj = [{
    date: date,
    text: text,
    user: user,
    user_description: user_description,
    followers: followers,
    location: location,
    place: place
  }];

  if (location || place != null || undefined && max !== undefined){
    console.log(obj);
    let headers_names = ['date','text','user','description','followers','location','place'];
    let csv = json2csv({ data: obj, fields: headers_names });

      // Saving results to a CSV file
      fs.appendFile('results.csv', csv, (err) => {
        if (err) throw err;
      });

  }
})
