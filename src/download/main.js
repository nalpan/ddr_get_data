import '@babel/polyfill';
import tingle from 'tingle.js';
import 'tingle.js/dist/tingle.min.css';

selectLevel();

/**
 * 
 */
function selectLevel(){
  // instanciate new modal
  var modal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: ['overlay', 'button', 'escape'],
    closeLabel: "Close",
    cssClass: ['custom-class-1', 'custom-class-2'],
    onOpen: function() {
        console.log('modal open');
    },
    onClose: function() {
        console.log('modal closed');
    }
  });

  // set content
  modal.setContent(`
    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">select level</h1>
    <select id="level-select" style="width: 100px; height: 30px; font-size: 16px; border: 1px solid silver;">
      <option selected>15</option>
      <option>16</option>
      <option>17</option>
      <option>18</option>
      <option>19</option>
    </select>
  `);

  // add a button
  modal.addFooterBtn('download csv', 'tingle-btn tingle-btn--primary tingle-btn--pull-right', async function() {
    const selectElm = document.querySelector('#level-select');
    const level = Number(selectElm.value);
    await downloadCSV(level);

    const elm = document.querySelector('#timestamp-script');
    elm.parentNode.removeChild(elm);
    modal.destroy();
  });

  // open modal
  modal.open();
}

/**
 * 
 * @param {*} level 
 */
async function downloadCSV(level){
  const infos = await getJson(level);
  const promises = infos.map(async data => {
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

  const content = result.reduce((prev, current) => {
    return [
      prev,
      `"${current.name}","${current.chart}","${current.timestamp}"`
    ].join('\n');
  }, 'music,chart,timestamp');

  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), content], {'type': 'text/csv'});
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${level}_timestamp.csv`;
  link.click();
}

/**
 * 
 * @param {*} level 
 */
async function getJson(level){
  const res = await fetch(
    `https://storage.googleapis.com/ddr-exscore-manager-bookmarklet/ddr_get_timestamp/json/${level}.json`,
    {
      headers:{
        'Content-type':'application/json'
      },
      method:"get",
    }
  );

  if(res.status !== 200){
    throw new Error('request error');
  }
  return res.json();
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

  if(res.status !== 200){
    return '';
  }

  const arrBuf = await res.arrayBuffer();
  const decoder = new TextDecoder("Shift_JIS");
  return decoder.decode(arrBuf);
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
