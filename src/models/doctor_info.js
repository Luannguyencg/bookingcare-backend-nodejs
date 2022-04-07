'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Doctor_info.belongsTo(models.Allcode, {foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceData'})
      Doctor_info.belongsTo(models.Allcode, {foreignKey: 'provinceId', targetKey: 'keyMap', as: 'provinceData'})
      Doctor_info.belongsTo(models.Allcode, {foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentData'})
      Doctor_info.belongsTo(models.Specialty, {foreignKey: 'specialtyId', as: 'specialtyData'})
      Doctor_info.belongsTo(models.Clinics, {foreignKey: 'clinicId', as: 'clinicData'})
      Doctor_info.belongsTo(models.User, { foreignKey: 'doctorId'})
     
    }
  }
  Doctor_info.init({
    doctorId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
    priceId: DataTypes.STRING,
    provinceId: DataTypes.STRING,
    paymentId: DataTypes.STRING,
    clinicAddress: DataTypes.STRING,
    clinicName: DataTypes.STRING,
    note: DataTypes.STRING,
    count: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Doctor_info',
  });
  return Doctor_info;
};