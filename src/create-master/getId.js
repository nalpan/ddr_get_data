const axios = require('axios').default;
const iconv = require('iconv-lite');
const cheerio = require('cheerio');

if(process.argv[2]){
  main(process.argv[2]);
}

async function main(diff){
  const urls = {
    "19": ['https://p.eagate.573.jp/game/ddr/ddra20/p/music/index.html?offset=0&filter=2&filtertype=19&playmode=0',],
    "18": ['https://p.eagate.573.jp/game/ddr/ddra20/p/music/index.html?offset=0&filter=2&filtertype=18&playmode=0',],
    "17": ['https://p.eagate.573.jp/game/ddr/ddra20/p/music/index.html?offset=0&filter=2&filtertype=17&playmode=0',],
    "16": [
      'https://p.eagate.573.jp/game/ddr/ddra20/p/music/index.html?offset=0&filter=2&filtertype=16&playmode=0',
      'https://p.eagate.573.jp/game/ddr/ddra20/p/music/index.html?offset=1&filter=2&filtertype=16&playmode=0',
    ],
    "15": [
      'https://p.eagate.573.jp/game/ddr/ddra20/p/music/index.html?offset=0&filter=2&filtertype=15&playmode=0',
      'https://p.eagate.573.jp/game/ddr/ddra20/p/music/index.html?offset=1&filter=2&filtertype=15&playmode=0',
      'https://p.eagate.573.jp/game/ddr/ddra20/p/music/index.html?offset=2&filter=2&filtertype=15&playmode=0',
    ]
  }
  const promises = urls[diff].map(async url => getHTML(url));

  const HTMLarr = await Promise.all(promises);

  const infoList = HTMLarr.map(html => {
    const $ = cheerio.load(html);
    const songs = $(`#data_tbl .data`);
    const infos = [];
    songs.each((i, element) => {
      const src = $(element).find('img').attr('src').match(/=+?.*\&/)[0].replace(/(=|\&)/g, '');
      const name = $(element).find('.music_tit').text();
      infos.push({id: src, name: name});
    });

    // infos.forEach(info => {console.log(`${info.id},${info.name}`)});
    return infos;
  });

  const result = [].concat(...infoList);
  console.log(JSON.stringify(result, null, '  '));
}

async function getHTML(url){
  const res = await axios.get(url, {
    responseType: 'arraybuffer'
  });
  // console.log(res.status);
  return iconv.decode(res.data, 'sjis');
}
