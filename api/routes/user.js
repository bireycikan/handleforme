const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const fileUpload = require('../utils/fileUpload');

const saltRounds = 10;


// signup
router.post('/signup', fileUpload.single("avatar"), async (req, res) => {
  if (!req.file) {
    throw new Error('FILE_MISSING')
  }
  else {
    try {
      const { fullname, email, phone, password } = req.body;
      const User = req.connection.model('User');
      const newUser = new User({
        fullname: fullname,
        email: email,
        phone: phone,
        imagepath: `/src/uploads/${req.file.filename}`
      })

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      newUser.pass = hashedPassword;

      const modifiedUser = _.omit(newUser.toObject(), ['__v', '_id']);
      req.session.userData = modifiedUser;

      await newUser.save();
      res.send({ success: true })
    } catch (err) {
      if (err.name === "MongoError" && err.code === 11000) {
        res.send({ success: false, message: "Email is used by another account you entered!" })
        return;
      }

      res.send({ success: false })
    }
  }
})

// login
router.get('/login', (req, res) => {
  if (!req.session.userData) {
    res.send({ success: false })
    return;
  }

  res.send({ success: true, user: req.session.userData })

})

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const User = req.connection.model('User');

  const user = await User.findOne({ $or: [{ email: username }, { phone: username }] }).exec();
  if (user) {
    const compareResult = await bcrypt.compare(password, user.pass);
    if (!compareResult) {
      res.send({ success: false, message: "Password is incorrect!" });
      return;
    }

    const modifiedUser = _.omit(user.toObject(), ['__v', '_id']);
    req.session.userData = modifiedUser;

    res.send({ success: true, user: modifiedUser })
  }
  else {
    res.send({ success: false, message: "User does not exist!" });
  }
})

// logout
router.get('/logout', (req, res) => {
  if (!req.session.userData) {
    res.send({ success: false, message: "Logged out user cannot logout." })
    return;
  }

  req.session.destroy();
  res.send({ success: true });
})


module.exports = router;