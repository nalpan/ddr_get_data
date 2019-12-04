import '@babel/polyfill';

import datas from '../output/15.json';

main(datas);

async function main(datas){
  const promises = datas.map(async data => {
    // diff:0～4
    // const diff = data.diff ? data.diff : ['2','3','4'];
    const times = await getTime(data.id, ['2','3','4']);
    return {
      name: times[0].name,
      dif: times[0].time,
      exp: times[1].time,
      cha: times[2].time,
    }
  });

  const result = await Promise.all(promises);
  console.log(result);

  const content = result.reduce((prev, current) => {
    return [
      prev,
      `${current.name},${current.dif},${current.exp},${current.cha}`
    ].join('\n');
  }, 'music,DIFFICULT,EXPERT,CHALLENGE');
  console.log(content);

  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), content], {'type': 'text/csv'});
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'sample.csv';
  link.click();
}

/**
 * IDと難易度からデータを取得する
 * @param {string} id 
 * @param {Array<number>} diff 
 * @returns {object}
 */
async function getTime(id, diff){
  console.log('getTime: ', id, diff);
  const htmls = await Promise.all(
    diff.map(async n => {
      return getHtml(id, n);
    })
  );

  const datas = htmls.map(html => {
    return parseHtmlToData(html)
  });
  console.log(datas);
  return datas;
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
function parseHtmlToData(html){
  const dom = new DOMParser().parseFromString(html, "text/html");
  if(!dom.querySelector('#music_detail_table tr:nth-child(4) td:nth-child(4)')){
    // 未プレイなど
    return {
      name: dom.querySelector('#music_info tr td:nth-child(2)').innerHTML.replace(/<.*$/, ''),
      time: ''
    }
  }
  return {
    name: dom.querySelector('#music_info tr td:nth-child(2)').innerHTML.replace(/<.*$/, ''),
    time: dom.querySelector('#music_detail_table tr:nth-child(4) td:nth-child(4)').textContent.trim()
  }
}
