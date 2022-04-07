import db from '../models/index';
import emailService from './emailService'
import _ from 'lodash';
require("dotenv").config();
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = '';


    result = `${process.env.URL_REACT}/veryfi-booking?token=${token}&doctorId=${doctorId}`
    return result
}


let postBookAppoinment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId
                || !data.timeType || !data.date
                || !data.fullName || !data.selectedGender
                || !data.doctorEmail || !data.address
                || !data.phonenumber
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let token = uuidv4();

                //create user patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: `R3`,
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName,
                        phonenumber: data.phonenumber
                    }
                })

                // update patient

                if (user && user[1] === false) {
                    let userPatient = await db.User.findOne({
                        where: { email: data.email },
                        raw: false,
                    })
                    if (userPatient) {
                        userPatient.gender = data.selectedGender
                        userPatient.address = data.address
                        userPatient.firstName = data.fullName
                        userPatient.phonenumber = data.phonenumber

                        await userPatient.save();

                    }
                }else{
                    await emailService.sendSimpleEmail({
                        reciverEmail: data.email,
                        patientName: data.fullName,
                        time: data.timeString,
                        doctorName: data.doctorName,
                        language: data.language,
                        doctorEmail: data.doctorEmail,
                        phonenumber: data.phonenumber,
                        redirectLink: buildUrlEmail(data.doctorId, token)
                    })
                }

                //create booking
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {

                            statusId: `S1`,
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }

                    })
                }
                // create a new booking record

                resolve({
                    errCode: 0,
                    message: 'save info patient success!!'
                })
            }






        } catch (e) {
            reject(e);
        }
    })
}


let postVeryfiBookAppoinment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let appoiment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: `S1`,
                    },
                    raw: false
                })

                if (appoiment) {
                    appoiment.statusId = `S2`
                    await appoiment.save()
                    resolve({
                        errCode: 0,
                        message: 'update the appoiment success'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist'
                    })
                }
            }

        } catch (e) {
            reject(e);
        }
    })
}




module.exports = {
    postBookAppoinment: postBookAppoinment,
    postVeryfiBookAppoinment: postVeryfiBookAppoinment

}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            