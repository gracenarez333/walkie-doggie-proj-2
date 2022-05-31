'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.pet.belongsToMany(models.user, {through: 'userPet'})
      models.pet.hasMany(models.comment)
    }
  }
  pet.init({
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    breed: DataTypes.STRING,
    sex: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pet',
  });
  return pet;
};