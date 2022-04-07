import db from "../models/index"
import bcrypt from 'bcryptjs'
const salt = bcrypt.genSaltSync(10);

let hasUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (err) {
            reject(err)
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}

            let isExist = await checkUserEmail(email)
            if (isExist) {
                //user already exists
                let user = await db.User.findOne({
                    attributes: ['id','email', 'roleId', 'password','firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                })
                if (user) {
                    // compare password against

                    let check = await bcrypt.compareSync(password, user.password); // false
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'ok';
                        
                        delete user.password;
                        userData.user = user;
                        

                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'wrong password';
                        userData.user = user
                    }

                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User's not found~~"

                }


            } else {
                //return err 
                userData.errCode = 1;
                userData.errMessage = "Your's email isn't exist in your system, please try other email"
            }
            resolve(userData)

        } catch (err) {
            reject(err)
        }
    })
}


let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (err) {
            reject(err);
        }
    })
}



let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = ''
            if (userId === 'ALL') {
                user = db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                user = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(user)
        } catch (err) {
            reject(err);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: "This email already exists, please use another email"
                })
            }else{
                
                let hashPasswordFromBcrypt = await hasUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    gender: data.gender,
                    roleId: data.role,
                    positionId: data.position,
                    image: data.avata,
                })
                resolve({
                    errCode: 0,
                    message: 'ok'
                })
            }
        } catch (err) {
            reject(err);
        }
    })
}

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {

            let user = await db.User.findOne({
                where: { id: id }
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "the user isn't exist"
                })
            }
            await db.User.destroy({
                where: { id: id }
            })

            resolve({
                errCode: 0,
                errMessage: 'the user is delete success'
            })
        } catch (err) {
            reject(err)
        }
    })
}


let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "missing required parameter"
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })

            if (user) {

                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.gender = data.gender;
                user.positionId = data.position; 
                user.roleId = data.role; 
                user.image = data.avata;

                await user.save()

                resolve({
                    errCode: 0,
                    message: "update user success"
                })
            }
            else {
                resolve({
                    errCode: 1,
                    message: "user is not found!"
                })
            }



        }
        catch (err) {
            reject(err)
        }
    })
}

let getAllCodeService = (typeInput)=>{
    return new Promise(async (resolve, reject)=>{
        try{
            if(!typeInput){
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                })
            }else{

                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput}
                })
                
                res.errCode = 0;
                res.data = allcode;
                resolve(res)
            }

        }catch(e){
            reject(e)
        }
    })
}


module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
}