import Vue from 'vue';

import App from '../Components/App.vue';

console.clear();
const root = document.createElement('div');
document.body.prepend(root); 
new Vue({
  el: root,
  render: createElement => createElement(App),
});

