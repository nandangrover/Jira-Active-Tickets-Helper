<template>
  <div class="navigation-bar">
    <div class="logo-holder">
      <img class="logo" :src="logo" /> 
    </div>
    <span class="icon-holder up" v-bind:class="{ hide: !iconState }" @click="toggleIcon">
      <i class="fas fa-chevron-up"></i>
    </span>
    <span class="icon-holder down" v-bind:class="{ hide: iconState }" @click="toggleIcon">
      <i class="fas fa-chevron-down"></i>
    </span>
    <span class="github-holder" @click="openGithub">
      <i class="fab fa-github"></i>
    </span>
  </div>
</template>

<script>

import logo from '../chrome/images/logo.png';

export default {
  name: 'navigation-bar',
  props: {
    display: {
      type: Boolean,
    },
  },
  components: { },
  data() {
    return {
      iconState : false,
      iconUp : "fas fa-chevron-up",
      iconDown : "fas fa-chevron-",
      logo : logo,
    }
  },

  computed : {
  },

  methods : {
    toggleIcon() {
      this.iconState = !this.iconState;
      this.$emit('update:display', !this.iconState);
    },

    openGithub() {
      window.open("https://github.com/nandangrover/jiraChromeExtension");
    }
  },
}

</script>

<style scoped>
.github-holder {
  float: right;
  padding-right: 10px; 
  cursor: pointer;
  color: #fff;
  font-size: 22px;
  margin-right: 20px;
}

.icon-holder {
  float: right;
  padding-right: 10px; 
  cursor: pointer;
  color: #fff;
  font-size: 22px;
}

.logo-holder {
  float: left;
  padding: 6px 0px 0 12px;
}

.logo {
  width: 50px;
}

.hide {
  display: none;
}

.navigation-bar {
  display: table;
  width: 100%;
  height: 35px;
  background-color: #194067;
}
</style>
