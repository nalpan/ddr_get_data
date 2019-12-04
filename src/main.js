import '@babel/polyfill';

// import {Table, Modal, Button} from 'buefy';

import getTime from './dataAccess';
import songData from './../resource/songs.json';
import './component.css';

main();

async function main(){
  await Promise.all([
    loadCSS(`https://unpkg.com/buefy/dist/buefy.min.css`),
    loadCSS(`https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css`),
    loadJavaScriptSrc('https://cdn.jsdelivr.net/npm/vue@2.6.0'),
  ]);

  await Promise.all([
    loadJavaScriptSrc('https://unpkg.com/buefy/dist/components/table'),
    loadJavaScriptSrc('https://unpkg.com/buefy/dist/components/modal'),
    loadJavaScriptSrc('https://unpkg.com/buefy/dist/components/button'),
  ]);

  console.log("load end");

  
  const node = document.createElement('div');
  node.id = 'app-kac9th';
  node.innerHTML = `
  <b-modal :active.sync="isImageModalActive">
    <div class="box">
      <b-table :data="datas" :columns="columns"></b-table>
      <div class="columns">
        <div class="column is-2 is-offset-10">
          <b-button type="is-success" size="is-small" @click="isImageModalActive = false">Close</b-button>
        </div>
      </div>
    </div>
  </b-modal>
  `;

  document.getElementsByTagName('body')[0].appendChild(node);

  console.log("dom created");

  // Vue.use(Table);
  // Vue.use(Modal);
  // Vue.use(Button);

  new Vue({
    el: '#app-kac9th',
    data: {
      isImageModalActive: false,
      datas: [],
    },
    computed: {
      columns: () => {
        return [
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
    },
    async created() {
      const promises = songData.map(async target => {
        return getTime(target.id, target.diff, target.name);
      });
      this.datas = await Promise.all(promises);
      // console.table(results);
      this.isImageModalActive = true;
    },
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
