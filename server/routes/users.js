var express = require('express');
var router = express.Router();
const User = require('../model/userSchema');
const userController = require('../controllers/userController');


/* GET users listing. */
router.post('/register', userController.register_user);

router.post('/login', userController.login_user);

router.post('/avatar', userController.update_userAvatar);

router.get('/:username', async function(req, res, next){
  const { username } = req.params;
  console.log('username => ', username);

  const user = await User.findOne({ username});
  if(!user)
    return res.send({msg: "User not found"});
  
  res.send({username, avatar: user.avatar});

})

module.exports = router;
