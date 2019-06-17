<template>
  <div id="section-table">
    <section>
      <b-table
      id="scrollbar"
      v-bind:class="{ defaultTable: hideScroll }"
      :data="data"
      :loading="loading"
      backend-sorting
      :default-sort-direction="defaultSortOrder"
      :default-sort="[sortField, sortOrder]"
      @sort="onSort">
        <template slot-scope="props">
            <b-table-column field="id" label="ID" :renderHtml="isTrue" numeric sortable>
                <a :href="returnLink(props.row.id)">{{ props.row.id }}</a>
            </b-table-column>

            <b-table-column field="description" label="Description">
              {{ props.row.description }}
            </b-table-column>

            <b-table-column field="comments" label="Comments" numeric sortable>
                <span class="tag" :class="type(props.row.comments)">
                  {{ props.row.comments }}
                </span>
            </b-table-column>

            <b-table-column field="status" label="Status" sortable>
                <span class="tag" :class="type(1000)">
                  {{ props.row.status }}
                </span>
            </b-table-column>

            <b-table-column field="pr" label="Pull Request" sortable>
              <span class="tag" :class="type(mapPr[props.row.pr])">
                  {{ props.row.pr }}
              </span>
            </b-table-column>
            <b-table-column field="dateAssigned" label="Assigned" numeric sortable>
              <span class="tag" :class="type(1500)">
                  {{ moment(props.row.dateAssigned).format('dd DD-MM-YYYY') }}
              </span>
            </b-table-column>
            <b-table-column field="dateCompleted" label="Completed" numeric sortable>
              <span class="tag" :class="type(1500)">
                  {{ props.row.dateCompleted !== 'No History Found' ? moment(props.row.dateCompleted).format('dd DD-MM-YYYY') : 'No History Found'}}
              </span>
            </b-table-column>
        </template>
      </b-table>
    </section>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'issue-table',
  props: {
    data: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
     display: {
      type: Boolean,
    },
  },

  data() {
    return {
      sortField: 'comments',
      sortOrder: 'desc',
      defaultSortOrder: 'desc',
      isTrue: true,
      hideScroll : true,
      mapPr : {
        "OPEN": 1500,
        "MERGED": 0,
        "EMPTY": 1500
      },
    }
  },

  watch: {
    loading(newVal) {
      this.hideScroll = newVal;
    },
    activeSprint(value) {
      console.log("hello", value);
      
    }
  },

  computed: {
   ...mapGetters['filter', { activeSprint: 'activeSprint' }],
  },

  methods: {
    onSort(field, order) {
      this.sortField = field;
      this.sortOrder = order;
      this.filter(field);
    },

    filter(field) {
      const mapStatus = {
        "In Progress": 0,
        "To Do": 1,
        "Ready For Test": 2,
        "Ready for Review": 3
      }
      const mapCommitInfo = {
        "OPEN": 0,
        "EMPTY": 1,
        "MERGED": 2,
      }
      const mapCompletedDate = {
        "No History Found" : 0,
      }
      switch(field) {
        case 'comments':
          this.data.sort((a, b) => {
            return this.sortOrder.toLowerCase() === 'asc' ? a.comments - b.comments : b.comments - a.comments;
          })
        break;
        case 'status':
          this.data.sort((a, b) => {
            return this.sortOrder.toLowerCase() === 'asc' ? mapStatus[a.status] - mapStatus[b.status] : mapStatus[b.status] - mapStatus[a.status];
          })
        break;
        case 'pr':
          this.data.sort((a, b) => {
            return this.sortOrder.toLowerCase() === 'asc' ? mapCommitInfo[a.pr] - mapCommitInfo[b.pr] : mapCommitInfo[b.pr] - mapCommitInfo[a.pr];
          })
        break;
        case 'id':
          this.data.sort((a, b) => {
            return this.sortOrder.toLowerCase() === 'asc' ? a.id.split('-')[1] - b.id.split('-')[1] : b.id.split('-')[1] - a.id.split('-')[1];
          })
        break;
        case 'dateAssigned':
          this.data.sort((a, b) => {
            return this.sortOrder.toLowerCase() === 'asc' ? this.dateExists(a.dateAssigned) - this.dateExists(b.dateAssigned) : this.dateExists(b.dateAssigned) - this.dateExists(a.dateAssigned);
          })
        break;
        case 'dateCompleted':
          this.data.sort((a, b) => {
            return this.sortOrder.toLowerCase() === 'asc' ? this.dateExists(a.dateCompleted) - this.dateExists(b.dateCompleted) : this.dateExists(b.dateCompleted) - this.dateExists(a.dateCompleted);
          })
        break;
        default:
          this.data.sort((a, b) => {
            return this.sortOrder.toLowerCase() === 'asc' ? b - a : a - b;
          })
        break;
      }
    },

    type(value) {
      const number = parseFloat(value)
      if (number <= 0) {
          return 'is-success'
      } else if (number >= 1 && number < 4) {
          return 'is-warning'
      } else if (number >= 4 && number < 200) {
          return 'is-danger'
      } else if (number === 1000) {
        return 'is-primary'
      } else if (number === 1500) {
        return 'basic'
      }
    },

    returnLink(link) {
      return `https://jira.cainc.com/browse/${link}`;
    },

    dateExists(date) {
      return date === 'No History Found' ? this.moment(0) : this.moment(date);
    }
  }
}

</script>

<style scoped>
.b-table {
  overflow-y: scroll;
  height: 160px;
  font-size: 14px;
  padding: 12px;
  min-width: 500px;
}

.defaultTable {
  overflow: hidden;
}

#section-table {
  display: table-cell;
  position: relative;
}

#scrollbar::-webkit-scrollbar-track
{
  box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #F5F5F5;
}

#scrollbar::-webkit-scrollbar
{
	width: 10px;
	background-color: #F5F5F5;
}

#scrollbar::-webkit-scrollbar-thumb
{
	background-color: #000000;
	border: 2px solid #555555;
}

</style>
