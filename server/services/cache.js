const mongoose = require("mongoose");
const redis = require("redis").createClient;
const util = require("util");

const client = redis(6379, "localhost");

client.hget = util.promisify(client.hget);

// modifying mongoose cache function
mongoose.Query.prototype.cache = function (options = {}) {
  // mode can be useCache, deleteInCache or updateInCache
  this.mode = options.mode;
  // collection name
//   this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);
  this.hashKey = this.mongooseCollection.name;
  console.log('collection name =>>>>', this.mongooseCollection.name);
  return this;
};

// store default exec()
const exec = mongoose.Query.prototype.exec;
let key = "userPosts";

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
  const cachedValue = await client.hget(this.hashKey, key);

  // query mongodb if cachedValue doesn't exist
  if (!cachedValue || cachedValue === "[]") {
    console.log("Returing data from mongodb...");
    const result = await exec.apply(this, arguments);
    client.hset(this.hashKey, key, JSON.stringify(result));

    return result;
  }

  let doc = JSON.parse(cachedValue);

  if (this.mode === "useCache"){
    // return cachedValue
    console.log("Returning data from redis...");
       
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }
};



module.exports.clearHash = function (hashKey) {
  client.del(JSON.stringify(hashKey));
};

module.exports.addNewPostToHash = async function(post){
    let obj = await client.hget("posts", "userPosts");
    obj = JSON.parse(obj);
    if(Array.isArray(obj)){
        obj = [...obj, post];
        client.hset("posts", "userPosts", JSON.stringify(obj));
        console.log("Updated posts hash in redis...");
    }
}

module.exports.deletePostInCache = async function(postId, hashKey){
  const cachedValue = await client.hget(hashkey, key);
  let doc = JSON.parse(cachedValue);
  if (Array.isArray(doc)) {
    doc = doc
      .map((d) => new mongoose.Query.prototype.model(d))
      .filter((d) => d._id != postId);

    // set updated hash
    client.hset(hashKey, key, JSON.stringify(doc));
    console.log("Updated posts hash in redis...");

    return doc;
  } else {
    doc = new mongoose.Query.prototype.model(doc);

    if (doc._id === postId) {
      client.del(JSON.stringify(hashKey));
      console.log("Deleted post in the redis hash...");
      return null;
    }

    return doc;
  }
}

module.exports.updatePostLikesInCache = async function(postId, userLikedList, hashkey){
  const cachedValue = await client.hget(hashkey, key);
  let doc = JSON.parse(cachedValue);
  if (Array.isArray(doc)) {
    doc = doc
      .map((d) => {
        console.log(typeof d);
        if (d._id === postId){
          d.userLikedList = userLikedList;
        }
        return d;
      });
     

    // set updated hash
    client.hset(hashkey, key, JSON.stringify(doc));
    console.log("Updated posts hash in redis...");

    return doc;
  } else {
    doc = new mongoose.model(doc);

    if (doc._id === postId) {
      doc.userLikedList = userLikedList;
      client.hset(hashKey, key, JSON.stringify(doc));
      console.log("Updated post in the redis hash...");
      return doc;
    }
  }
}

