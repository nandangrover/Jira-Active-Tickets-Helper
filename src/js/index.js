import Vue from 'vue';
import Buefy from 'buefy';
// import 'buefy/dist/buefy.css';
import '@fortawesome/fontawesome-free/js/all.js';
import App from '../Components/App.vue';

Vue.use(Buefy, {
  defaultIconPack: 'fas'
});
console.clear();

const link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', chrome.runtime.getURL("scoped.css"));

const link2 = document.createElement('link');
link2.setAttribute('rel', 'stylesheet');
link2.setAttribute('href', chrome.runtime.getURL("buefy.min.css"));

const shadowElement = document.createElement('div');
document.body.prepend(shadowElement);
let shadow = shadowElement.attachShadow({mode: 'closed'});

shadow.appendChild(link);
shadow.appendChild(link2);

// chrome.runtime.getURL("buefy.min.css");

const root = document.createElement('div');
// document.body.prepend(root);
shadow.appendChild(root);

new Vue({
  el: root,
  render: createElement => createElement(App),
});
