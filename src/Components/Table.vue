<template>
  <div id="section-table">
    <b-table :data="data" :columns="columns"></b-table>
  </div>
</template>

<script>


export default {
  name: 'issue-table',
  props: {
    data: {
      type: Array,
    },
    columns: {
      type: Array,
    },
  },

  watch: {
  },

  computed: {
  }
}

</script>

<style scoped>
.b-table {
  overflow: scroll;
  height: 160px;
  width: 600px;
  font-size: 14px;
  padding: 12px;
}

#section-table {
  display: inline-flex;
  float: right;
}

</style>
