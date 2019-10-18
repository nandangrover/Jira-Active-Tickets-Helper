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
    <!-- Filter without overhead. Currently doesn't work -->
    <!-- <template v-if="selectedOption === 'done'">
      <div class="align-center">
        <b-field grouped group-multiline>
          <div class="control">
              <b-switch v-model="activeSprintState" size="is-small">Active Sprint</b-switch>
              <b-switch v-model="lastSprintState"  size="is-small">Last Sprint</b-switch>
          </div>
        </b-field>
      </div>
    </template> -->
  </div>
</template>

<script>

import jira from '../gateways/jira';
import { mapState, mapMutations } from 'vuex';
import { find } from 'lodash';

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
        id: 'statusToday',
        name: 'Status Today'
      },
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
      },
      {
        id: 'doneActive',
        name: 'Done Tickets(Active Sprint)'
      }],
      selectedOption: 'statusToday',
    };
  },

  computed: {
    ...mapState['filter', ['activeSprint', 'lastSprint']],

    // Toggle Filters for Active sprint and last sprint
    activeSprintState: {
      get: function() {
        return this.activeSprint;
      },
      set: function(newVal) {
        this.$store.commit('toggleActiveSprint', newVal);
      }
    },

     lastSprintState: {
      get: function() {
        return this.lastSprint;
      },
      set: function(newVal) {
        this.$store.commit('toggleLastSprint', newVal);
      }
    }
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
        case 'doneActive':
          this.issuesRaw = await jira.getDoneActiveTickets();
        break;
        case 'statusToday':
          const raw = await jira.getStatusForToday();
          this.issuesRaw = this.filterStatusToday(raw);
        break;
        default:
        break; 
      }
      this.modifyIssues();
    },

    filterStatusToday(raw) {
      const { name } = this.currentUser;
      raw.issues = raw.issues.filter(issue => {
        const { fields } = issue;
        const statusName = fields.status.name;
        
        // Currently in progress and assigned to you and in progress right now
        if (fields.assignee && (fields.assignee.name === name) && (statusName === 'In Progress')) {
          return true;
        }

         // Done today
        const endDate = this.endedWorkOn(issue.changelog);
        const isCompletedToday = this.moment(new Date(endDate)).format('D dd') === this.moment(new Date()).format('D dd');

        if (((fields.status.name === 'Done') || (statusName === 'Closed')) && isCompletedToday) {
          return true;
        }
        return false;
      });
      return raw;
    },

    startedWorkOn(log) {
      let { name } = this.currentUser;
      let { histories } = log;
      histories = histories.filter(({ author }) => author.name === name);
     return histories[0] ? histories[0].created : 'No History Found';
    },

    endedWorkOn(log) {
      let { histories } = log;
      histories = histories.filter(({ items }) => {
       return  _.find(items, function(i) { return i.field === 'status' && (i.toString === 'Done' || i.toString === 'Closed'); }) ? true : false;
      });
      return histories[histories.length - 1] ? histories[histories.length - 1].created : 'No History Found';
    },

    async getCommitInfo(key) {
    let issue = await jira.getCommitInfo(key);
    return issue;
    },
    
    /**
     * Modify issues to include the date parameter
     */
    modifyIssues() {
      let startDate,endDate;
      
      this.modifiedIssues = this.issuesRaw.issues.map((issue) => {
        startDate = this.startedWorkOn(issue.changelog);
        endDate = this.endedWorkOn(issue.changelog);
        issue.dateStartedWorking = startDate;
        issue.dateEndedWorking = endDate;
        return issue;
      });
       this.generateData();
    },
    
    async generateData() {
      this.data.splice(0, this.data.length);
      // Empty clipData before generating new issues
      this.clipData = '';
      for (let i = 0; i < this.modifiedIssues.length; i++) {
          const commitInfo = await this.getCommitInfo(this.modifiedIssues[i]['id']);

          this.data.push({id: this.modifiedIssues[i]['key'], description: `${this.modifiedIssues[i]['key']}: ${this.modifiedIssues[i]['fields']['summary']}`, comments: this.modifiedIssues[i].fields.comment.total, status: this.modifiedIssues[i].fields.status.name, pr: commitInfo.summary.pullrequest.overall.count ? commitInfo.summary.pullrequest.overall.state : "EMPTY",  dateAssigned: this.modifiedIssues[i].dateStartedWorking, dateCompleted: this.modifiedIssues[i].dateEndedWorking});

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
  padding: 10px;
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

.align-center {
  position: relative;
  display: flex;
  justify-content: center;
}

</style>