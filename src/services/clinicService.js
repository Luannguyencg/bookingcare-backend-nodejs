import db from '../models/index';
import _ from 'lodash';
require("dotenv").config();
import { v4 as uuidv4 } from 'uuid';



let createNewClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64
                || !data.descriptionHTML || !data.descriptionMarkdown
                || !data.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {

                // create a new
                await db.Clinics.create({
                    name: data.name,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.imageBase64,
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

let getAllClinic = (inputId) => {
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
                data = await db.Clinics.findAll()
            }
            if (inputId && inputId !== 'ALL') {
                data = await db.Clinics.findOne({
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
let handleDeleteClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required paremeter!'
                })
            } else {

                let clinic = await db.Clinics.findOne({
                    where: { id: id }
                })
                if (!clinic) {
                    resolve({
                        errCode: 2,
                        errMessage: "clinic isn't exist"
                    })
                } else {

                    await db.Clinics.destroy({
                        where: { id: id }
                    })

                    resolve({
                        errCode: 0,
                        errMessage: 'delete clinic success'
                    })
                }
            }

        } catch (err) {

            reject(err);
        }
    })
}
let handleEditClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.descriptionHTML
                || !data.descriptionMarkdown || !data.name
                || !data.imageBase64 || !data.address) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let clinic = await db.Clinics.findOne({
                    where: { id: data.id },
                    raw: false
                })

                if (clinic) {

                    clinic.name = data.name;
                    clinic.address = data.address
                    clinic.descriptionHTML = data.descriptionHTML;
                    clinic.descriptionMarkdown = data.descriptionMarkdown;
                    clinic.image = data.imageBase64;


                    await clinic.save()
                    resolve({
                        errCode: 0,
                        message: "update clinic success"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'clinic is not found !!'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getDetailClinicById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required parameter!!'
                })
            } else {

                let data = await db.Clinics.findOne({
                    where: { id: id },
                    attributes: ['name','descriptionHTML', 'descriptionMarkdown'],

                })
                if (data) {
                    let doctorClinic = [];

                    doctorClinic = await db.Doctor_info.findAll({
                        where: { clinicId: id },
                        attributes: ['doctorId', 'provinceId'],
                    })

                    data.doctorClinic = doctorClinic
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
    createNewClinic: createNewClinic,
    getAllClinic: getAllClinic,
    handleDeleteClinic: handleDeleteClinic,
    handleEditClinic: handleEditClinic,
    getDetailClinicById: getDetailClinicById
}






