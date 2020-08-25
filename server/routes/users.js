var express = require('express');
var router = express.Router();
const User = require('../model/userSchema');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.post('/register', async function(req, res, next) {
  const userData = req.body;
  console.log(userData);

  // validation
  if (!userData.email || !userData.fullname || !userData.username || !userData.password){
     return res.status(400).send({msg: 'Not all fields are filled.'})
  }

  if (userData.password !== userData.passwordCheck)
    return res.status(400).send({msg: 'Passwords do not match.'})

  const user = new User(userData);
  const savedUser = await user.save();
  res.send({user: savedUser.username});

});

router.post('/login', async function(req, res, next){
  const userData = req.body;

  const user = await User.findOne({ email: userData.email});

  if (!user)
    return res.status(400).send({msg: 'User not found with these details'});

  const match = bcrypt.compare(userData.password, user.password);
  if(!match)
    return res.status(400).send({msg: 'Incorrect password for this user'});

  res.send({user: user.username});
})

module.exports = router;
