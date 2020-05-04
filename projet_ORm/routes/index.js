const express = require('express');
const router = express.Router();
const model = require('../models')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Carte' });
});

router.get('/register', function(req, res, next) {
  res.render('user/form', { title: 'Enregistrer' });
});

router.post("/register", async (req, res, next) => {

  try {

    if (req.body.username && req.body.firstname && req.body.lastname &&
      req.body.password && req.body.confirmPassword) {

      if (req.body.password === req.body.confirmPassword) {
        console.log('coucou')
      } else {
        throw new Error("Vos mots de passe de correspondent pas.")
      }

    } else {
      throw new Error("Il manque des informations à rentrer. Veuillez vérifier.")
    }

    const alreadyTaken = await model.User.findOne({
      where: {
        username: req.body.username
      }
    })

    if (alreadyTaken) {
      throw new Error("Ce nom d'utilisateur est déjà pris.")
    }

    const newUser = await model.User.create({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password
    })

    res.format({

      html: () => {
        res.redirect('/')
      },

      json: () => {
        res.json(newUser)
      }
    })

  } catch (Err) {
    next(Err)
  }
})

router.get("/login", (req, res, next) => {

  res.render("user/login", {
    title: "Login"
  })
})

router.post("/login", async (req, res, next) => {

  try {

    if (!req.body.username || !req.body.password) {
      throw new Error("Missing information")
    }

    let user = await db.User.findOne({
      where: {
        username: req.body.username
      }
    })

    if (!user) {
      throw new Error("Unknown username")
    }

    const token = await Token.getRandom()
    const now = new Date()
    let expireDate = new Date()

    // 1 hour session max
    expireDate.setHours(now.getHours() + 1)

    await db.Session.create({
      accessToken: token,
      userId: user.id,
      expiresAt: expireDate
    })

    res.format({

      html: () => {
        res.cookie('AccessToken', token, {
          maxAge: 900000,
          httpOnly: true
        })
        res.redirect('/')
      },

      json: () => {
        res.json({
          accessToken: token
        })
      }
    })

  } catch (Err) {
    next(Err)
  }
})


module.exports = router;
