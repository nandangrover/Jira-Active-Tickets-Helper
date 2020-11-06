import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default {
  getUserInfo() {
    return axios
      .get(`https://jira.mdsol.com/rest/api/2/myself`)
      .then(res => res.data);
  },

  getAllIssues() {
    return axios
      .get(`https://jira.mdsol.com/rest/api/2/search?jql=watcher%20%3D%20currentUser()&maxResults=5000&fields=key,id,comment,status,summary&expand=changelog`)
      .then(res => res.data);
  },

  getActiveIssues() {
    return axios
      .get(`https://jira.mdsol.com/rest/api/2/search?jql=watcher%20%3D%20currentUser()%20AND%20status!%3DDone%20AND%20status!%3DClosed&fields=key,id,comment,status,summary&expand=changelog`)
      .then(res => res.data);
  },

  getDoneTickets() {
    return axios
      .get(`https://jira.mdsol.com/rest/api/2/search?jql=watcher%20%3D%20currentUser()%20AND%20(status%20%3DDone%20OR%20status%20%3D%20Closed%20)&fields=key,id,comment,status,summary&expand=changelog&maxResults=5000`)
      .then(res => res.data);
  },

  getDoneActiveTickets() {
    return axios
      .get(`https://jira.mdsol.com/rest/api/2/search?jql=watcher%20%3D%20currentUser()%20AND%20(status%20%3DDone%20OR%20status%20%3D%20Closed%20)%20AND%20sprint%20in%20openSprints()&fields=key,id,comment,status,summary&expand=changelog&maxResults=5000`)
      .then(res => res.data);
  },

  getSingleIssue(key) {
    return axios
      .get(`https://jira.mdsol.com/rest/api/2/issue/${key}?expand=changelog&fields=comment,status,summary`)
      .then(res => res.data);
  },

  getCommitInfo(key) {
    return axios
      .get(`https://jira.mdsol.com/rest/dev-status/latest/issue/summary?issueId=${key}`)
      .then(res => res.data);
  },

  getStatusForToday() {
    return axios
      .get(`https://jira.mdsol.com/rest/api/2/search?jql=watcher%20%3D%20currentUser()%20AND%20sprint%20in%20openSprints()&fields=key,id,comment,status,summary,assignee&expand=changelog&maxResults=5000`)
      .then(res => res.data);
  },
}