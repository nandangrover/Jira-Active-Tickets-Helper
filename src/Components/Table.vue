<template>
  <div id="section-table">
    <b-table 
    :data="data"
    :loading="loading"
    backend-sorting
    :default-sort-direction="defaultSortOrder"
    :default-sort="[sortField, sortOrder]"
    @sort="onSort">
      <template slot-scope="props">
          <b-table-column field="id" label="ID" :renderHtml="isTrue" sortable>
              <a :href="returnLink(props.row.id)">{{ props.row.id }}</a>
          </b-table-column>

          <b-table-column field="description" label="Description" sortable>
             {{ props.row.description }}
          </b-table-column>

          <b-table-column field="comments" label="Comments" numeric sortable>
             <span class="tag" :class="type(props.row.comments)">
                   {{ props.row.comments }}
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
    columns: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
  },

  data() {
    return {
      sortField: 'vote_count',
      sortOrder: 'desc',
      defaultSortOrder: 'desc',
      isTrue: true,
    }
  },

  computed: {
  },

  methods: {
    onSort(field, order) {
      this.sortField = field;
      this.sortOrder = order;
      this.filter();
    },

    filter() {
      this.data.sort((a, b) => {
        return this.sortOrder.toLowerCase() === 'asc' ? a.comments - b.comments : b.comments - a.comments;
      })
    },

    type(value) {
      const number = parseFloat(value)
      if (number < 6) {
          return 'is-danger'
      } else if (number >= 6 && number < 8) {
          return 'is-warning'
      } else if (number >= 8) {
          return 'is-success'
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
