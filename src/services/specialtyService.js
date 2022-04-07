import db from '../models/index';
import _ from 'lodash';
require("dotenv").config();
import { v4 as uuidv4 } from 'uuid';



let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64
                || !data.descriptionHTML || !data.descriptionMarkdown

            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {

                // create a new
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    message: ' success!!'
                })
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getAllspecialty = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required paremeter!'
                })
            }
            let data = ''
            if (inputId === 'ALL') {
                data = await db.Specialty.findAll()
            }
            if (inputId && inputId !== 'ALL') {
                data = await db.Specialty.findOne({
                    where: { id: inputId },

                })
            }
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary')
                    return item;
                })
            }


            resolve({
                errCode: 0,
                data
            })
        } catch (err) {

            reject(err);
        }
    })
}
let handleDeleteSpecialty = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required paremeter!'
                })
            } else {

                let specialty = await db.Specialty.findOne({
                    where: { id: id }
                })
                if (!specialty) {
                    resolve({
                        errCode: 2,
                        errMessage: "speciaty isn't exist"
                    })
                } else {

                    await db.Specialty.destroy({
                        where: { id: id }
                    })

                    resolve({
                        errCode: 0,
                        errMessage: 'delete specialty success'
                    })
                }
            }

        } catch (err) {

            reject(err);
        }
    })
}
let handleEditSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.descriptionHTML
                || !data.descriptionMarkdown || !data.name
                || !data.imageBase64) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let specialty = await db.Specialty.findOne({
                    where: { id: data.id },
                    raw: false
                })

                if (specialty) {

                    specialty.name = data.name;
                    specialty.descriptionHTML = data.descriptionHTML;
                    specialty.descriptionMarkdown = data.descriptionMarkdown;
                    specialty.image = data.imageBase64;


                    await specialty.save()
                    resolve({
                        errCode: 0,
                        message: "update user success"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Specialty is not found !!'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getDetailSpecialtyById = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required parameter!!'
                })
            } else {

                let data = await db.Specialty.findOne({
                    where: { id: id },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],

                })
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_info.findAll({
                            where: { specialtyId: id },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    } else {
                        // find by location
                        doctorSpecialty = await db.Doctor_info.findAll({
                            where: {
                                specialtyId: id,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }

                    data.doctorSpecialty = doctorSpecialty

                }
                resolve({
                    errCode: 0,
                    data
                })



            }
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createNewSpecialty: createNewSpecialty,
    getAllspecialty: getAllspecialty,
    handleDeleteSpecialty: handleDeleteSpecialty,
    handleEditSpecialty: handleEditSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById
}






