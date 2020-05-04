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

/* Route get pour afficher les infos d'un utilisateur id */
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

/* Route get pour modifer un utilisateur spécifique avec id */
router.get("/:userId/edit", async (req, res, next) => {

  try {

      const user = await model.User.findByPk(req.params.userId)

      res.render("user/patch", {
          title: "Modifier un utilisateur",
          user: user,
      })

  } catch (Err) {
      next(Err)
  }

})

/* Route post pour enlever un utilisateur */
router.post("/:userId", async (req, res, next) => {

  try {

      const supprimer = await model.User.destroy({
          where: {
              id: req.params.userId,
          }
      })

      res.format({

          html: () => {
              res.redirect('/user')
          },

          json: () => {
              res.json(supprimer)
          }
      })

  } catch (Err) {
      next(Err)
  }
})


/* Route post pour modifier un utilisateur */
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
              res.redirect('/user')
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
