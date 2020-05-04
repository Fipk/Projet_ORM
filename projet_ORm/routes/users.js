const express = require('express');
const router = express.Router();
const model = require('../models')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const users = await model.User.findAndCountAll()

    res.format({

        html: () => {
            res.render("user/list",{
                title: "Users",
                count: users.count,
                users: users.rows
            })
        },

        json: () => {
            res.json(users)
        }
        })

} catch (Err) {
   next(Err)
}
});

router.get("/:userId", async (req, res, next) => {

  try {

      const user = await model.User.findByPk(req.params.userId)

      res.format({

          html: () => {
              res.render("user/info", {
                  title: "User",
                  user: user,
              })
          },

          json: () => {
              res.json(user)
          }
      })

  } catch (Err) {
      next(Err)
  }
})

router.get("/ajouter", async (req, res, next) => {

  res.render("carte/form", {
    title: "Ajouter une carte"
  })
})

router.get("/:userId/edit", async (req, res, next) => {

  try {

      const user = await model.User.findByPk(req.params.userId)

      res.render("user/patch", {
          title: "Modifier une carte",
          user: user,
      })

  } catch (Err) {
      next(Err)
  }

})

router.post("/", async (req, res, next) => {

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

router.post("/:userId", async (req, res, next) => {

  try {

      const supprimer = await model.User.destroy({
          where: {
              id: req.params.userId,
          }
      })

      res.format({

          html: () => {
              res.redirect('/users')
          },

          json: () => {
              res.json(supprimer)
          }
      })

  } catch (Err) {
      next(Err)
  }
})

router.post("/:userId/patch", async (req, res, next) => {

  try {

      let changes = {}
      let where = {
          where: {
              id: req.params.userId
          }
      }
    
      if (req.body.firstname) {
          changes.firstname = req.body.firstname
      }
      if (req.body.username) {
          changes.username = req.body.username
      }
      if (req.body.lastname) {
          changes.lastname = req.body.lastname
      }
    

      const result = await model.User.update(changes, where)

      res.format({

          html: function () {
              res.redirect('/users')
          },

          json: function () {
              res.json(result)
          }
      })

  } catch (Err) {
      next(Err)
  }
})

module.exports = router;
