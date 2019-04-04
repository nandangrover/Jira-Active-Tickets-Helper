<template>
  <div id="section-issue">
    <button class="issue-generate" @click="getIssues">Generate Issues</button>
    <button class="issue-generate" v-bind:class="{ disable: isActive }" @click="copyToClipboard">Copy Description</button>
    <button class="issue-generate" v-bind:class="{ disable: isActive }">Export Excel</button>
    <input ref="inputField" v-model="clipData">
  </div>
</template>

<script>

import jira from '../gateways/jira';

export default {
  name: 'issues-generator',
  props: {
    data: {
      type: Array,
    },
    columns: {
      type: Array,
    },
  },

  data() {
    return {
      message: 'Hello World',
      isActive: true,
      issuesRaw: [],
      filteredIssues: [],
      clipData: "",
    };
  },

  mounted() {
    this.columns.push({ field: 'id', label: 'ID', });
    this.columns.push({ field: 'description', label: 'Description', });
  },

  computed: {
  },

  watch: {
    data(newValue) {  
      this.$emit('update:data', this.data);
    },
    columns(newValue) {  
      this.$emit('update:columns', this.data);
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
          this.data.push({id: this.filteredIssues[i]['key'], description: `${this.filteredIssues[i]['key']}: ${this.filteredIssues[i]['fields']['summary']}`});
          this.clipData.concat(`${this.filteredIssues[i]['key']}: ${this.filteredIssues[i]['fields']['summary']}\n`);

          console.log(this, `${this.filteredIssues[i]['key']}: ${this.filteredIssues[i]['fields']['summary']}\n`);
          
      }
      // this.clipData = "wasssup"
      
      this.isActive = false;
    },

    copyToClipboard(event) {
      console.log(this.$refs.inputField.value);
      console.log(this.clipData);
      
      this.$refs.inputField.select();
      document.execCommand('copy');
    //  window.copy("hellllllll");
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
  margin-right: 10px;
  cursor: pointer;
}

#section-issue {
  display: inline-flex;
}

.disable {
  background-color: #797777;
}
</style>