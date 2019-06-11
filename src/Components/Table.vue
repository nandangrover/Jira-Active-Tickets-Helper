<template>
  <div id="section-table">
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
              <span class="tag" :class="type(10)">
                {{ props.row.status }}
              </span>
          </b-table-column>

          <b-table-column field="pr" label="Pull Request" sortable>
            <span class="tag" :class="type(mapPr[props.row.pr])">
                {{ props.row.pr }}
            </span>
          </b-table-column>
          <b-table-column field="date" label="Assigned Date" numeric sortable>
            <span class="tag" :class="type(15)">
                {{ moment(props.row.date).format('dddd DD-MM-YYYY HH:mm') }}
            </span>
          </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>


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
        "OPEN": 15,
        "MERGED": 0,
        "EMPTY": 15
      },
    }
  },

  mounted() {
  },

  watch: {
    loading(newVal) {
      this.hideScroll = newVal;
    }
  },

  computed: {
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
         case 'date':
          this.data.sort((a, b) => {
            return this.sortOrder.toLowerCase() === 'asc' ? this.moment(a.date) - this.moment(b.date) : this.moment(b.date) - this.moment(a.date);
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
      } else if (number >= 4 && number < 10) {
          return 'is-danger'
      } else if (number === 10) {
        return 'is-primary'
      } else if (number === 15) {
        return 'basic'
      }
    },

    returnLink(link) {
      return `https://jira.cainc.com/browse/${link}`;
    },
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
