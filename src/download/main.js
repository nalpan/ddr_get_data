import '@babel/polyfill';

import songinfo from '../../resource/songdata/15.json';

main(songinfo);

async function main(songinfo){
  // TODO: JSONを動的にとる
  const promises = songinfo.map(async data => {
    if(!data.id || !data.diff){
      return {
        name: '',
        chart: '',
        timestamp: ''
      }
    }
    const html = await getHtml(data.id, data.diff);
    return parseHtmlToData(html, data.diff);
  });

  const result = await Promise.all(promises);
  console.log(result);

  const content = result.reduce((prev, current) => {
    return [
      prev,
      `${current.name},${current.chart},${current.timestamp}`
    ].join('\n');
  }, 'music,chart,timestamp');
  console.log(content);

  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), content], {'type': 'text/csv'});
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'sample.csv';
  link.click();
}

/**
 * IDと難易度から譜面情報を取得する
 * @param {string} id 曲ID
 * @param {number} diff 難易度
 * @returns {string} HTML
 */
async function getHtml(id, diff){
  console.log('getHtml: ', id, diff)
  const url = `https://p.eagate.573.jp/game/ddr/ddra20/p/playdata/music_detail.html?index=${id}&diff=${diff}`;
  const res = await fetch(
    url,
    {
      headers:{
        'Content-type':'text/html;charset=Windows-31J'
      },
      method:"get",
    }
  );
  const arrBuf = await res.arrayBuffer();
  const decoder = new TextDecoder("Shift_JIS");
  if(res.status === 200){
    return decoder.decode(arrBuf);
  }else{
    return '';
  }
  
}

/**
 * HTMLをパースしてデータを抜き出す
 * @param {*} html
 * @returns string 
 */
function parseHtmlToData(html, diff){
  let chart;
  switch(diff){
  case 0:
    chart = 'beginner'
    break;
  case 1:
      chart = 'basic'
      break;
  case 2:
      chart = 'difficult'
      break;
  case 3:
      chart = 'expert'
      break;
  case 4:
      chart = 'challenge'
      break;
  }

  const dom = new DOMParser().parseFromString(html, "text/html");
  if(!dom.querySelector('#music_detail_table tr:nth-child(4) td:nth-child(4)')){
    // 未プレイなど
    return {
      name: dom.querySelector('#music_info tr td:nth-child(2)').innerHTML.replace(/<.*$/, ''),
      chart: chart,
      timestamp: ''
    }
  }
  return {
    name: dom.querySelector('#music_info tr td:nth-child(2)').innerHTML.replace(/<.*$/, ''),
    chart: chart,
    timestamp: dom.querySelector('#music_detail_table tr:nth-child(4) td:nth-child(4)').textContent.trim()
  }
}
