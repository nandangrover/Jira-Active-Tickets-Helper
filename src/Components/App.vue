<template>
  <div id="app">
    <div class="navigationBar">
      <navigation-bar
      :display.sync="display">
      </navigation-bar>
    </div>
    <div v-bind:class="{ hideHolder: display, contentHolder: !display }">
      <issues-generator
        :data="data"
        :loading="loading">
      </issues-generator>
      <issue-table
        :data.sync="data"
        :loading="loading"
        :display="display">>
      </issue-table>
      </div>
  </div>
</template>

<script>

import IssuesGenerator from './IssuesGenerator.vue';
import IssueTable from './Table.vue';
import NavigationBar from './Navigation.vue';

export default {
  components: { IssuesGenerator, IssueTable, NavigationBar },
  data() {
    return {
      data: [],
      columns: [],
      loading: false,
      display: true
    }
  },

  mounted() {
    this.$root.$on('update:loading', () => {
      this.loading = !this.loading;
    })
  }
}

</script>

<style scoped>
#app {
  position: relative;
  display: grid;
  background-color: #ffffff;
}

.hideHolder {
  display: none;
}

.contentHolder {
  display: flex;
  justify-content: center;
}
.on-hide {
  background-color: #868a8e;
  height: 30px;
}
</style>
