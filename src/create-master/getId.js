const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const fetchHtml = require('./fetchHtml.js');


main(process.argv[2]);

async function main(fileName){
  let HTMLarr;
  try{
    HTMLarr = [fs.readFileSync(path.resolve(__dirname, '..', '..', 'resource', 'html', fileName))];
  }catch(err){
    console.log(`file not found`);
    console.log(err);
    HTMLarr = fetchHtml();
  }
  const infoList = HTMLarr.map(html => {
    const $ = cheerio.load(html);
    const songs = $(`#data_tbl .data`);
    const infos = [];
    songs.each((i, element) => {
      const src = $(element).find('img').attr('src').match(/=+?.*\&/)[0].replace(/(=|\&)/g, '');
      const name = $(element).find('.data td:first-child .music_info').text();
      infos.push({id: src, name: name});
    });

    // infos.forEach(info => {console.log(`${info.id},${info.name}`)});
    return infos;
  });

  const result = [].concat(...infoList);
  console.log(JSON.stringify(result, null, '  '));
}
