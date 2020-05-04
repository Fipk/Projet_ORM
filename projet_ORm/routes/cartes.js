const express = require('express');
const router = express.Router();
const model = require('../models')

/* Route get afficher toutes les cartes */
router.get('/', async (req, res, next) => {
    try {
        const cartes = await model.Carte.findAndCountAll()
    
        res.format({
    
            html: () => {
                res.render("carte/list",{
                    title: "Cartes",
                    count: cartes.count,
                    cartes: cartes.rows
                })
            },
    
            json: () => {
                res.json(cartes)
            }
            })
    
    } catch (Err) {
       next(Err)
    }
});

/* Route get pour ajouter une carte */
router.get("/ajouter", async (req, res, next) => {

    res.render("carte/form", {
      title: "Ajouter une carte"
    })
})

/* Route get pour afficher les infos d'une carte id */
router.get("/:carteId", async (req, res, next) => {

    try {
  
        const carte = await model.Carte.findByPk(req.params.carteId)
  
        res.format({
  
            html: () => {
                res.render("carte/info", {
                    title: carte.firstname,
                    carte: carte,
                })
            },
  
            json: () => {
                res.json(carte)
            }
        })
  
    } catch (Err) {
        next(Err)
    }
})

/* Route get pour modifer une carte spécifique avec id */
router.get("/:carteId/edit", async (req, res, next) => {

    try {
  
        const carte = await model.Carte.findByPk(req.params.carteId)
  
        res.render("carte/patch", {
            title: "Modifier une carte",
            carte: carte,
        })
  
    } catch (Err) {
        next(Err)
    }
  
})

/* Route post pour ajouter une carte */
router.post("/", async (req, res, next) => {

    try {
  
        if (req.body.firstname && req.body.genre && req.body.type &&
        req.body.damage && req.body.defense && req.body.health) {

        console.log('coucou')

        } else {
        throw new Error("Il manque des informations à rentrer. Veuillez vérifier.")
        }
  
        const newUser = await model.Carte.create({
            firstname: req.body.firstname,
            genre: req.body.genre,
            type: req.body.type,
            damage: req.body.damage,
            defense: req.body.defense,
            health: req.body.health
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

/* Route post pour enlever une carte */
router.post("/:carteId", async (req, res, next) => {

    try {
  
        const supprimer = await model.Carte.destroy({
            where: {
                id: req.params.carteId,
            }
        })
  
        res.format({
  
            html: () => {
                res.redirect('/cartes')
            },
  
            json: () => {
                res.json(supprimer)
            }
        })
  
    } catch (Err) {
        next(Err)
    }
})

/* Route post pour modifier une carte */
router.post("/:carteId/patch", async (req, res, next) => {

    try {
  
        let changes = {}
        let where = {
            where: {
                id: req.params.carteId
            }
        }
      
        if (req.body.firstname) {
            changes.firstname = req.body.firstname
        }
        if (req.body.genre) {
            changes.genre = req.body.genre
        }
        if (req.body.type) {
            changes.type = req.body.type
        }
        if (req.body.defense) {
            changes.defense = req.body.defense
        }
        if (req.body.damage) {
            changes.damage = req.body.damage
        }
        if (req.body.health) {
            changes.health = req.body.health
        }
      
  
        const result = await model.Carte.update(changes, where)

        res.format({
  
            html: function () {
                res.redirect('/cartes')
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
