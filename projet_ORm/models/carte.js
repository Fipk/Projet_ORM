'use strict';
module.exports = (sequelize, DataTypes) => {
  const Carte = sequelize.define('Carte', {
    firstname: DataTypes.STRING,
    genre: DataTypes.STRING,
    type: DataTypes.STRING,
    damage: DataTypes.INTEGER,
    defense: DataTypes.INTEGER,
    health: DataTypes.INTEGER
  }, {});
  Carte.associate = function(models) {
    // associations can be defined here
  };
  return Carte;
};