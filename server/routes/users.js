var express = require('express');
var router = express.Router();
const User = require('../model/userSchema');
const authController = require('../controllers/authController');


/* GET users listing. */
router.post('/register', authController.register_user);

router.post('/login', authController.login_user);


router.get('/:username', async function(req, res, next){
  const { username } = req.params;
  console.log('username => ', username);

  const user = await User.findOne({ username});
  if(!user)
    return res.send({msg: "User not found"});
  
  res.send({username, avatar: user.avatar});

})

module.exports = router;
