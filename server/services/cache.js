const mongoose = require("mongoose");
const redis = require("redis").createClient;
const util = require("util");

const client = redis(6379, "localhost");

client.hget = util.promisify(client.hget);

// modifying mongoose cache function
mongoose.Query.prototype.cache = function (options = {}) {
  // can be useCache or editCache
  this.mode = options.mode;
  this.args = options.args;
  // collection name
//   this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);
  this.hashKey = this.mongooseCollection.name;
  console.log('collection name =>>>>', this.mongooseCollection.name);
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
  let key = "userPosts";

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

  if (this.mode === "useCache" && !this.args) {
    // return cachedValue
    console.log("Returning data from redis...");

    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  if (this.mode === "editCache" && this.args) {
    // delete posts in db
    const result = await exec.apply(this, arguments);
    if (result){
        console.log('Deleted post from mongodb');
    }

    if (Array.isArray(doc)) {
      doc = doc
        .map((d) => new this.model(d))
        .filter((d) => d._id != this.args.postId);

      // set updated hash
      client.hset(this.hashKey, key, JSON.stringify(doc));
      console.log("Updated posts hash in redis...");

      return doc;
    } else {
      doc = new this.model(doc);

      if (doc._id === this.args.postId) {
        client.del(JSON.stringify(hashKey));
        console.log("Deleted post in the redis hash...");
        return null;
      }

      return doc;
    }
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