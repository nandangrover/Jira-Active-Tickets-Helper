<template>
  <div id="section-table">
    <b-table
    id="scrollbar"
    v-bind:class="{ overflowHidden: hideScroll }"
    :data="data"
    :loading="loading"
    backend-sorting
    :default-sort-direction="defaultSortOrder"
    :default-sort="[sortField, sortOrder]"
    @sort="onSort">
      <template slot-scope="props">
          <b-table-column field="id" label="ID" :renderHtml="isTrue">
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
      const map = {
        "In Progress": 0,
        "Ready For Test": 1,
        "Ready for Review": 2
      }
      switch(field) {
        case 'comments':
         this.data.sort((a, b) => {
        return this.sortOrder.toLowerCase() === 'asc' ? a.comments - b.comments : b.comments - a.comments;
      })
        break;
        case 'status':
       this.data.sort((a, b) => {
        return  this.sortOrder.toLowerCase() === 'asc' ? map[a.status] - map[b.status] : map[b.status] - map[a.status];
      })
        break;
         default:
       this.data.sort((a, b) => {
        return  map[a.status] - map[b.status];
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
      }
      else if (number === 10) {
        return 'is-primary'
      }
    },

    returnLink(link) {
      return `https://jira.cainc.com/browse/${link}`;
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
}

.overflowHidden {
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
