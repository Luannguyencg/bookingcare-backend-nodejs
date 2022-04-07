'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clinics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Clinics.hasOne(models.Doctor_info, {foreignKey: 'clinicId', as: 'clinicData'})
    }
  }
  Clinics.init({ //phòng khám 
    
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    descriptionHTML: DataTypes.TEXT,
    descriptionMarkdown: DataTypes.TEXT,
    image: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Clinics',
  });
  return Clinics;
};