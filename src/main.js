import '@babel/polyfill';

import getTime from './dataAccess';
import songData from './../resource/songs.json';

main();

async function main(){
  await Promise.all([
    loadCSS(`https://unpkg.com/buefy/dist/buefy.min.css`),
    loadJavaScriptSrc('https://cdn.jsdelivr.net/npm/vue@2.6.0'),
  ]);

  await Promise.all([
    loadJavaScriptSrc('https://unpkg.com/buefy/dist/components/table'),
    loadJavaScriptSrc('https://unpkg.com/buefy/dist/components/modal'),
  ]);

  console.log("load end");

  const promises = songData.map(async target => {
    return getTime(target.id, target.diff, target.name);
  });

  const results = await Promise.all(promises);

  console.table(results);
  
  const node = document.createElement('div');
  node.id = 'app-kac9th';
  node.innerHTML = `
  <b-modal :active.sync="isImageModalActive">
    <b-table :data="datas" :columns="columns"></b-table>
  </b-modal>
  `;

  document.getElementsByTagName('body')[0].appendChild(node);

  console.log("dom created");

  new Vue({
    el: '#app-kac9th',
    data: {
      isImageModalActive: true,
      datas: results,
      columns: [
        {
          field: "music",
          label: "music"
        },
        {
          field: "time",
          label: "Latest play"
        },
      ]
    }
  });
}

async function loadCSS(url){
  const tag = document.createElement('link');
  tag.setAttribute('rel','stylesheet');
  tag.setAttribute('type','text/css');
  tag.setAttribute('href',url);
  document.getElementsByTagName('head')[0].appendChild(tag);
  return new Promise((res, rej) => {
    tag.onload = () => res();
    tag.onerror = () => rej();
  });
}

async function loadJavaScriptSrc(url){
  const tag = document.createElement('script');
  tag.setAttribute('src', url);
  document.getElementsByTagName('head')[0].appendChild(tag);
  return new Promise((res, rej) => {
    tag.onload = () => res();
    tag.onerror = () => rej();
  });
}
