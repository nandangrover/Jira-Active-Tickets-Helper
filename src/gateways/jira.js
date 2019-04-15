import axios from 'axios';
axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';

export default {
  getUserInfo() {
    return axios
      .get(`https://jira.cainc.com/rest/api/2/myself`)
      .then(res => console.log(res));
  },

  getIssues() {
    return axios
      .get(`https://jira.cainc.com/rest/api/2/search?jql=watcher=currentUser()&&status!=Done`)
      .then(res => res.data);
  },

  getSingleIssue(key) {
    return axios
      .get(`https://jira.cainc.com/rest/api/2/issue/${key}`)
      .then(res => res.data);
  },

  getCommitInfo(key) {
    return axios
      .get(`https://jira.cainc.com/rest/dev-status/latest/issue/summary?issueId=${key}`)
      .then(res => res.data);
  }
}