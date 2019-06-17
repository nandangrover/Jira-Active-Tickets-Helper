import Vue from 'vue';
import Buefy from 'buefy';
import App from '../Components/App.vue';
import resolveStyleSheet from '../utils/resolveStyleSheet.js';
import moment from 'moment';
import store from '../store'

Vue.prototype.moment = moment

Vue.use(Buefy, {
  defaultIconPack: 'fas'
});
console.clear();

const shadowElement = document.createElement('div');
document.body.prepend(shadowElement);
let shadow = shadowElement.attachShadow({mode: 'closed'});

// Map stylesheets to use inside shadow root
const iconStyle = resolveStyleSheet(chrome.runtime.getURL("fontawesome.css"), document.head);
const stylesList = ["buefy.min.css", "scoped.css", "fontawesome.css"].map((style) => resolveStyleSheet(chrome.runtime.getURL(style), shadow));

// Resolve Promises and Vue element to shadow root
Promise.all([iconStyle, ...stylesList]).then(() => {
  const root = document.createElement('div');
  shadow.appendChild(root);

  new Vue({
    el: root,
    store,
    render: createElement => createElement(App),
  });
});
