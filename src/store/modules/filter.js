export default {
  state: {
    activeSprint: false,
    lastSprint: false,
  },

  getters: {
    activeSprint: state => state.activeSprint,
    lastSprint: state => state.lastSprint,
  },

  mutations: {
    toggleActiveSprint(state, value) { 
      state.activeSprint = value;
    },
    toggleLastSprint(state, value) {
      state.lastSprint = value;
    }
  },
}