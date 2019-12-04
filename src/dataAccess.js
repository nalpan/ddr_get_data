/**
 * IDと難易度からデータを取得する
 * @param {string} id 
 * @param {number} diff 
 * @returns {object}
 */
export default async function getTime(id, diff, name){
  const html = await getHtml(id, diff);
  return parseHtmlToData(html, name);
}

/**
 * IDと難易度から譜面情報を取得する
 * @param {string} id 曲ID
 * @param {number} diff 難易度
 * @returns {string} HTML
 */
async function getHtml(id, diff){
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
  console.log("res", res);
  return res.text();
}

/**
 * HTMLをパースしてデータを抜き出す
 * @param {*} html
 * @returns {object} 
 */
function parseHtmlToData(html, name){
  console.log(html);
  const dom = new DOMParser().parseFromString(html, "text/html");
  console.log(dom.querySelector('#music_info tr td:nth-child(2)').innerHTML);
  return {
    music: name,
    // music: dom.querySelector('#music_info tr td:nth-child(2)').innerHTML.replace(/<.*$/, ''),
    time: dom.querySelector('#music_detail_table tr:nth-child(4) td:nth-child(4)').textContent.trim()
  };
}
