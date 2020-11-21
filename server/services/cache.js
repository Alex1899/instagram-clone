const mongoose = require("mongoose");
const redis = require("redis").createClient;
const util = require("util");

const client = redis(6379, "localhost");

client.hget = util.promisify(client.hget);
let key = "userPosts";
let hashKey = "posts";

// modifying mongoose cache function
mongoose.Query.prototype.cache = function (options = {}) {
  // mode can be useCache, deleteInCache or updateInCache
  this.mode = options.mode;
  this.userId = options.userId;
  // collection name
  //   this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);
  //hashKey = this.mongooseCollection.name;
  console.log("collection name =>>>>", this.mongooseCollection.name);
  return this;
};

// store default exec()
const exec = mongoose.Query.prototype.exec;

// modify mongoose exec()
mongoose.Query.prototype.exec = async function () {
  if (!this.mode) {
    return await exec.apply(this, arguments);
  }

  //   const key = JSON.stringify({
  //     ...this.getFilter(),
  //     collection: this.mongooseCollection.name,
  //   });

  // get cached value from redis
  const cachedValue = await client.hget(hashKey, key);

  // query mongodb if cachedValue doesn't exist
  if (!cachedValue || cachedValue === "[]") {
    console.log("Returing data from mongodb...");
    const result = await exec.apply(this, arguments);
    if (result.length >= 1) {
      client.hset(
        hashKey,
        key,
        JSON.stringify({ userId: this.userId, posts: result })
      );
    }

    return result;
  }

  let obj = JSON.parse(cachedValue);

  if (this.mode === "useCache") {
    // return cachedValue
    console.log("Returning data from redis...");

    if (obj.userId == this.userId) {
      return Array.isArray(obj.posts)
        ? obj.posts.map((d) => new this.model(d))
        : new this.model(obj.posts);
    }
  }
};

module.exports.clearHash = function (hashKey) {
  client.del(JSON.stringify(hashKey));
};

module.exports.addNewPostToHash = async function (userId, post) {
  let obj = await client.hget(hashKey, key);
  if (obj) {
    obj = JSON.parse(obj);
    if (obj.userId == userId) {
      if (Array.isArray(obj.posts)) {
        obj.posts = [...obj.posts, post];
        client.hset(hashKey, key, JSON.stringify({ userId, posts: obj.posts }));
        console.log("Updated posts hash in redis...");
      }
    } else {
      console.log("cannot add post to hash! UserId is wrong!");
    }
  } else {
    client.hset(hashKey, key, JSON.stringify({ userId, posts: post }));
  }
};

module.exports.deletePostInCache = async function (userId, postId) {
  let obj = await client.hget(hashKey, key);
  if (obj) {
    obj = JSON.parse(obj);
    if (obj.userId == userId) {
      if (Array.isArray(obj.posts)) {
        obj.posts = obj.posts
          .map((d) => new mongoose.Query.prototype.model(d))
          .filter((d) => d._id != postId);

        // set updated hash
        client.hset(hashKey, key, JSON.stringify({ userId, posts: obj.posts }));
        console.log("Updated posts hash in redis...");

        return obj.posts;
      } else {
        let post = obj.posts;
        post = new mongoose.Query.prototype.model(post);

        if (post._id === postId) {
          client.del(JSON.stringify(hashKey));
          console.log("Deleted post in the redis hash...");
          return null;
        }

        return post;
      }
    }
  } else {
    console.log("redis cache empty");
  }
};

module.exports.updatePostLikesInCache = async function (
  userId,
  postId,
  userLikedList
) {
  let obj = await client.hget(hashKey, key);
  if (obj) {
    obj = JSON.parse(obj);
    if (obj.userId == userId) {
      if (Array.isArray(obj.posts)) {
        obj.posts = obj.posts.map((d) => {
          console.log(typeof d);
          if (d._id === postId) {
            d.userLikedList = userLikedList;
          }
          return d;
        });

        // set updated hash
        client.hset(hashKey, key, JSON.stringify({ userId, posts: obj.posts }));
        console.log("Updated posts hash in redis...");

        return obj.posts;
      } else {
        let post = obj.posts;
        post = new mongoose.model(post);

        if (post._id === postId) {
          post.userLikedList = userLikedList;
          client.hset(hashKey, key, JSON.stringify({ userId, posts: obj }));
          console.log("Updated post in the redis hash...");
          return post;
        }
      }
    }
  } else {
    console.log("redis cache empy");
  }
};
