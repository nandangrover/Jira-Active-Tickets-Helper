<template>
  <div id="section-issue">
    <div class="feature-button">
      <button class="issue-generate" @click="getIssues">Generate Issues</button>
      <button class="issue-generate" v-bind:class="{ disable: isActive }" 
      @click="copyToClipboard">Copy Description</button>
    </div>
    <textarea class="clipTextArea" ref="inputField" v-model="clipData" v-bind:class="{ showArea: addDisplay }"> </textarea>
    <div class="align-bottom">
      <b-taglist attached>
        <b-tag type="is-dark" size="is-medium">Active Tickets</b-tag>
        <b-tag type="is-success" size="is-medium">{{activeTicket}}</b-tag>
      </b-taglist>
    </div>
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
    loading: {
      type: Boolean,
    },
  },

  data() {
    return {
      isActive: true,
      issuesRaw: [],
      filteredIssues: [],
      clipData: "",
      addDisplay: true,
      activeTicket: "",
    };
  },

  methods: {
    async getIssues() {
      this.$root.$emit('update:loading');
      this.issuesRaw = await jira.getIssues();
      this.filter();
    },

    async getSingleIssue(key) {
      let issue = await jira.getSingleIssue(key);
      return issue;
    },

    async getCommitInfo(key) {
    let issue = await jira.getCommitInfo(key);
    return issue;
    },

    filter() {
       this.filteredIssues = this.issuesRaw.issues.filter((issue) => issue);
       this.generateData();
    },
    
    async generateData() {
      this.data.splice(0, this.data.length);
      for (let i = 0; i < this.filteredIssues.length; i++) {
          const issue = await this.getSingleIssue(this.filteredIssues[i]['id']);  
          const commitInfo = await this.getCommitInfo(this.filteredIssues[i]['id']);

          this.data.push({id: this.filteredIssues[i]['key'], description: `${this.filteredIssues[i]['key']}: ${this.filteredIssues[i]['fields']['summary']}`, comments: issue.fields.comment.total, status: issue.fields.status.name, pr: commitInfo.summary.pullrequest.overall.count ?commitInfo.summary.pullrequest.overall.state : "EMPTY" });

          // For copying data to clipboard
          this.clipData = this.clipData.concat(`${this.filteredIssues[i]['key']}: ${this.filteredIssues[i]['fields']['summary']}\n`);
      }
      this.activeTicket = this.filteredIssues.length;
      this.isActive = false;
      this.$root.$emit('update:loading');
    },

    copyToClipboard(event) {
      this.addDisplay = false;
      this.$refs.inputField.select();
      document.execCommand('copy');
    }
  }
};
</script>

<style scoped>

.issue-generate {
  margin: 0 auto;
  border: 1px solid #c4c4c4;
  text-align: center;
  font-size: 15px;
  line-height: 21px;
  border: none;
  color: #fff;
  background-color: #1976d2;
  border-radius: 5px;
  padding: 12px;
  margin-right: 10px;
  cursor: pointer;
}

#section-issue {
  display: table-cell;
  position: relative;
}

.disable {
  background-color: #797777;
}

.clipTextArea {
  margin: 0px;
  position: absolute;
  left: 615px;
  top: -131px;
}

.showArea {
  display: block;
}

.align-bottom {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 40px;
}

.feature-button {
  position: relative;
  display: flex;
  padding-left: 80px;
  padding-right: 90px;
  padding: 20px 80px 0 90px;
}

</style>