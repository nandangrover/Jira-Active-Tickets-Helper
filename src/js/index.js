import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import App from '../Components/App.vue';

Vue.use(Buefy);

console.clear();
const root = document.createElement('div');
document.body.prepend(root); 
new Vue({
  el: root,
  render: createElement => createElement(App),
});

