<template>
  <div id="section-table">
  </div>
</template>

<script>


export default {
  name: 'issue-table',
  props: {
    issues: {
      type: Array,
    },
  },

  watch: {
    test(newVal) {
      // console.log(newVal);
    }
  },

  computed: {
    test() {
      return this.issues;
    }
  }
}

</script>

<style scoped>

</style>
