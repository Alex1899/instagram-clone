const axios = require('axios');


module.exports.getAllUserPosts = (userId) => {
    axios
    .get(`/api/posts/${userId}`)
    .then((response) => {
      console.log(response.data);
      setPosts(response.data.posts);
      setFetchPosts(false);
    })
    .catch((error) => console.log(error));
}