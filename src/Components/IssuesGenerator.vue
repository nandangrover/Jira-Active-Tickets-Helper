<template>
  <div id="section-issue">
    <div class="feature-button">
      <button class="button issue-generate" @click="getIssues">Generate Issues</button>
      <button class="button issue-generate" v-bind:class="{ disable: isActive }" 
      @click="copyToClipboard">Copy Description</button>
    </div>
    <textarea class="clipTextArea" ref="inputField" v-model="clipData" v-bind:class="{ showArea: addDisplay }"> </textarea>
    <div class="align-bottom">
        <b-field>
            <b-select v-model="selectedOption" placeholder="Select a Filter Option">
                <option
                    v-for="option in options"
                    :value="option.id"
                    :key="option.id">
                    {{ option.name }}
                </option>
            </b-select>
        </b-field>
      <b-tag type="is-dark" size="is-medium" class="numberOfTickets">{{activeTicket}}</b-tag>
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
      modifiedIssues: [],
      clipData: "",
      addDisplay: true,
      activeTicket: 0,
      currentUser: [],
      options: [
      {
        id: 'active',
        name: 'Active Tickets'
      },
      {
        id: 'all',
        name: 'All Tickets'
      },
      {
        id: 'done',
        name: 'Done Tickets'
      }],
      selectedOption: 'active',
    };
  },

  methods: {
    async getIssues() {
      this.$root.$emit('update:loading');
      this.currentUser = await jira.getUserInfo();

      // Generate issue according to the selected Filter
      switch(this.selectedOption) {
        case 'all':
          this.issuesRaw = await jira.getAllIssues();
        break;
        case 'active':
          this.issuesRaw = await jira.getActiveIssues();
          break;
        case 'done':
          this.issuesRaw = await jira.getDoneTickets();
        break;
        default:
        break; 
      }
      this.modifyIssues();
    },

    async getSingleIssue(key) {
      let issue = await jira.getSingleIssue(key);
      // Get history of when user started working on that issue
      let startDate = this.startedWorkOn(issue.changelog);
      issue.dateStartedWorking = startDate;
      return issue;
    },

    startedWorkOn(log) {
      let { name } = this.currentUser;
      let { histories } = log;
      console.log(log);
      histories = histories.filter(({ author }) => author.name === name);
      return histories[0].created || 'No History Found';
    },

    async getCommitInfo(key) {
    let issue = await jira.getCommitInfo(key);
    return issue;
    },
    
    /**
     * Modify issues to include the date parameter
     */
    modifyIssues() {
      let startDate;
       this.modifiedIssues = this.issuesRaw.issues.map((issue) => {
         startDate = this.startedWorkOn(issue.changelog);
         issue.dateStartedWorking = startDate;
         return issue;
         });
       this.generateData();
    },
    
    async generateData() {
      this.data.splice(0, this.data.length);
      // Empty clipData before generating new issues
      this.clipData = '';
      for (let i = 0; i < this.modifiedIssues.length; i++) {
          // const issue = await this.getSingleIssue(this.modifiedIssues[i]['id']);
          const commitInfo = await this.getCommitInfo(this.modifiedIssues[i]['id']);

          this.data.push({id: this.modifiedIssues[i]['key'], description: `${this.modifiedIssues[i]['key']}: ${this.modifiedIssues[i]['fields']['summary']}`, comments: this.modifiedIssues[i].fields.comment.total, status: this.modifiedIssues[i].fields.status.name, pr: commitInfo.summary.pullrequest.overall.count ? commitInfo.summary.pullrequest.overall.state : "EMPTY",  date: this.modifiedIssues[i].dateStartedWorking});

          // For copying data to clipboard
          this.clipData = this.clipData.concat(`${this.modifiedIssues[i]['key']}: ${this.modifiedIssues[i]['fields']['summary']}\n`);
      }
      this.activeTicket = this.modifiedIssues.length;
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
  background-color: #194067;
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

.numberOfTickets {
  margin-top: 2px;
}

</style>