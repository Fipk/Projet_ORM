const express = require('express');
const router = express.Router();
const model = require('../models')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello' });
});

// Route pour enregistrer un utilisateur en get
router.get("/register", async (req, res, next) => {

  res.render("user/form", {
    title: "Ajouter un utilisateur"
  })
})

// route pour enregistrer un utulisateur en post
router.post("/", async (req, res, next) => {

  try {

    if (req.body.username && req.body.firstname && req.body.lastname &&
      req.body.password && req.body.confirmPassword) {

        hashedPassword = await bcrypt.hash(req.body.password)

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
      password: hashedPassword
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

module.exports = router;
