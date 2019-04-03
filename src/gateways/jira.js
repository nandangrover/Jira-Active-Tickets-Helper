import axios from 'axios';

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
  }
}