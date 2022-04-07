import db from '../models/index';
import _ from 'lodash';
require("dotenv").config();
import emailService from './emailService'
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true
                // raw: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}


let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e);
        }
    })
}

let checkReqiredFields = (data) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown',
        'priceId', 'provinceId', 'paymentId', 'clinicAddress', 'clinicName',
        'specialtyId', 'clinicId'
    ]

    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!data[arrFields[i]]) {
            isValid = false;
            element = arrFields[i]
            break;
        }

    }
    return {
        isValid: isValid,
        element: element
    }
}
let postInfoDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkReqiredFields(data)

            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `missing parameter ${checkObj.element}`
                })
            }
            else {

                await db.Markdown.findOrCreate({
                    where: { doctorId: data.doctorId },
                    defaults: {
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        doctorId: data.doctorId,
                    }

                })
                await db.Doctor_info.findOrcreate({
                    where: { doctorId: data.doctorId },
                    defaults: {
                        doctorId: data.doctorId,
                        priceId: data.priceId,
                        provinceId: data.provinceId,
                        paymentId: data.paymentId,
                        clinicAddress: data.clinicAddress,
                        clinicName: data.clinicName,
                        specialtyId: data.specialtyId,
                        clinicId: data.clinicId,
                        note: data.note
                    }

                })

                resolve({
                    errCode: 0,
                    message: 'save.info doctor',
                })
            }
        } catch (e) {
            reject(e);
        }
    })

}

let getInfoDoctor = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing required parameter'
                })
            }
            else {

                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary')
                }
                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getInfoMarkdownDoctor = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!!'
                })
            } else {
                let data = await db.Markdown.findOne({
                    where: { doctorId: id },
                })

                if (!data) {
                    data = {}
                }

                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}


let editInfoMarkdownDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!!'
                })
            }
            let markdown = await db.Markdown.findOne({
                where: { doctorId: data.doctorId },
                raw: false,
            })

            if (markdown) {
                markdown.contentHTML = data.contentHTML
                markdown.contentMarkdown = data.contentMarkdown
                markdown.description = data.description
                markdown.updatedAt = new Date();

                await markdown.save()
                resolve({
                    errCode: 0,
                    message: 'Update markdown is successfully!'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'markdown is not found!!'
                })
            }

        } catch (e) {
            reject(e);
        }
    })

}
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!!!'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {

                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }


                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })



                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                })


                if (toCreate && toCreate.length > 0) {

                    await db.Schedule.bulkCreate(toCreate)
                }

                resolve({
                    errCode: 0,
                    message: 'save success'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleDoctorByDate = (date, doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) {
                    data = [];
                }

                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let saveDoctorInfo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.priceId ||
                !data.provinceId || !data.paymentId ||
                !data.clinicAddress || !data.clinicName ||
                !data.specialtyId || !data.clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {

                let doctorInfo = await db.Doctor_info.findOrCreate({
                    where: { doctorId: data.doctorId },
                    defaults: {
                        doctorId: data.doctorId,
                        priceId: data.priceId,
                        provinceId: data.provinceId,
                        paymentId: data.paymentId,
                        clinicAddress: data.clinicAddress,
                        clinicName: data.clinicName,
                        specialtyId: data.specialtyId,
                        clinicId: data.clinicId,
                        note: data.note
                    }

                })

                if (doctorInfo && doctorInfo[1] === true) {
                    resolve({
                        errCode: 0,
                        message: 'creat doctor info success!'
                    })
                } else {
                    let doctorInfo = await db.Doctor_info.findOne({
                        where: { doctorId: data.doctorId },
                        raw: false,
                    })
                    if (doctorInfo) {
                        doctorInfo.priceId = data.priceId;
                        doctorInfo.provinceId = data.provinceId;
                        doctorInfo.paymentId = data.paymentId;
                        doctorInfo.clinicName = data.clinicName;
                        doctorInfo.clinicAddress = data.clinicAddress;
                        doctorInfo.specialtyId = data.specialtyId;
                        doctorInfo.clinicId = data.clinicId;
                        doctorInfo.note = data.note;

                        await doctorInfo.save();
                        resolve({
                            errCode: 0,
                            message: 'Update is successfully!'
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: 'doctor info is not found!!'
                        })
                    }
                }


            }
        } catch (e) {
            reject(e);
        }
    })
}

let getDoctorInfoById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!!'
                })
            } else {
                let data = await db.Doctor_info.findOne({
                    where: { doctorId: doctorId },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Specialty, as: 'specialtyData', attributes: ['name', 'id'] },
                        { model: db.Clinics, as: 'clinicData', attributes: ['name', 'id'] },

                    ],
                    raw: false,
                    nest: true
                })

                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {

            reject(e);
        }
    })
}



let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }

            let data = await db.User.findOne({
                where: { id: doctorId },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                    {
                        model: db.Doctor_info,
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] }
                        ]
                    }
                ],
                raw: false,
                nest: true
            })
            if (data && data.image) {
                data.image = new Buffer(data.image, 'base64').toString('binary')
            }
            if (!data) {
                data = {}
            }

            resolve({
                errCode: 0,
                data
            })

        } catch (e) {
            reject(e);
        }
    })
}

let getListPatientforDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        },
                        {model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']}

                    ],
                    raw: false,
                    nest: true
                })


                resolve({
                    errCode: 0,
                    data
                })
            }




        } catch (e) {
            reject(e);
        }
    })
}
let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email|| !data.doctorId||
                 !data.patientId || !data.timeType ||
                  !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
               
                // update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId, 
                        patientId: data.patientId, 
                        timeType: data.timeType, 
                        date: data.date,
                        statusId: 'S2'
                    },
                    raw: false
                })

                if(appointment){
                    appointment.statusId = 'S3'
                    await appointment.save()
                }

                // send email
                await emailService.sendAttackment(data)
                resolve({
                    errCode: 0,
                   message: 'ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    postInfoDoctor: postInfoDoctor,
    getInfoDoctor: getInfoDoctor,
    getInfoMarkdownDoctor: getInfoMarkdownDoctor,
    editInfoMarkdownDoctor: editInfoMarkdownDoctor,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    saveDoctorInfo: saveDoctorInfo,
    getDoctorInfoById: getDoctorInfoById,

    getProfileDoctorById: getProfileDoctorById,
    getListPatientforDoctor: getListPatientforDoctor,
    sendRemedy:sendRemedy

}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            