<template>
  <div id="section-issue">
    <button class="issue-generate" @click="getIssues">Generate Issues</button>
  </div>
</template>

<script>

import jira from '../gateways/jira';

export default {
  name: 'issues-generator',
  props: {
    issues: {
      type: Array,
    },
  },

  data() {
    return {
      message: 'Hello World',
      issuesRaw: [],
      filteredIssues: [],
      data: [],
      columns: [],
    };
  },

  computed: {
  },

  watch: {
    filteredIssues(newValue) {  
      this.$emit('update:data', this.filteredIssues);
    }
  },

  methods: {
    async getIssues() {
       this.issuesRaw = await jira.getIssues();
       this.filter();
    },

    filter() {
       this.filteredIssues = this.issuesRaw.issues.filter((issue) => issue.fields.status.name !== 'Done');
       this.generateData();
    },
    
    generateData() {
      for (let i = 0; i < this.filteredIssues.length; i++) {
        Object.keys(this.filteredIssues[i]).forEach((key) => {
          console.log(key);
          
        })
      }
    }
  }
};
</script>

<style scoped>
.issue-generate {
  margin: 0 auto;
  border: 1px solid #c4c4c4;
  position: relative;
  text-align: left;
  font-size: 15px;
  line-height: 21px;
  border: none;
  color: #fff;
  background-color: #1976d2;
  border-radius: 5px;
  padding: 12px;
  top: 38px;
  left: 25px;
  cursor: pointer;
}
</style>