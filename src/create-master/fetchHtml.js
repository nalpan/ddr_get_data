const axios = require('axios').default;
const iconv = require('iconv-lite');

module.exports = async function fetchHtml(diff){
  const urls = {
    "19": ['https://p.eagate.573.jp/game/ddr/ddra20/p/playdata/music_data_single.html?offset=0&filter=2&filtertype=19&playmode=0',],
    "18": ['https://p.eagate.573.jp/game/ddr/ddra20/p/playdata/music_data_single.html?offset=0&filter=2&filtertype=18&playmode=0',],
    "17": ['https://p.eagate.573.jp/game/ddr/ddra20/p/playdata/music_data_single.html?offset=0&filter=2&filtertype=17&playmode=0',],
    "16": [
      'https://p.eagate.573.jp/game/ddr/ddra20/p/playdata/music_data_single.html?offset=0&filter=2&filtertype=16&playmode=0',
      'https://p.eagate.573.jp/game/ddr/ddra20/p/playdata/music_data_single.html?offset=1&filter=2&filtertype=16&playmode=0',
    ],
    "15": [
      'https://p.eagate.573.jp/game/ddr/ddra20/p/playdata/music_data_single.html?offset=0&filter=2&filtertype=15&playmode=0',
      'https://p.eagate.573.jp/game/ddr/ddra20/p/playdata/music_data_single.html?offset=1&filter=2&filtertype=15&playmode=0',
      'https://p.eagate.573.jp/game/ddr/ddra20/p/playdata/music_data_single.html?offset=2&filter=2&filtertype=15&playmode=0',
    ]
  }
  const promises = urls[diff].map(async url => getHTML(url));

  return await Promise.all(promises);
}

async function getHTML(url){
  const res = await axios.get(url, {
    responseType: 'arraybuffer'
  });
  // console.log(res.status);
  return iconv.decode(res.data, 'sjis');
}
