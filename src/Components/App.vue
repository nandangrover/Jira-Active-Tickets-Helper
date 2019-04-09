<template>
  <div id="app">
    <issues-generator
      :data="data"
      :loading="loading">
    </issues-generator>
    <issue-table
      :data.sync="data"
      :loading.sync="loading">
    </issue-table>
  </div>
</template>

<script>

import IssuesGenerator from './IssuesGenerator.vue';
import IssueTable from './Table.vue';

export default {
  components: { IssuesGenerator, IssueTable },
  data() {
    return {
      data: [],
      columns: [],
      loading: false,
    }
  },

  mounted() {
    this.$root.$on('update:loading', () => {
      this.loading = !this.loading;
    })
  }
}

</script>

<style>

</style>

<style scoped>
#app {
  height: 120px;
}
</style>
