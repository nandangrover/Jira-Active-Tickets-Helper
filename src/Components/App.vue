<template>
  <div id="app">
    <issues-generator
      :data="data"
      :columns="columns">
    </issues-generator>
    <issue-table
      :data.sync="data"
      :columns.sync="columns">
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
    }
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
