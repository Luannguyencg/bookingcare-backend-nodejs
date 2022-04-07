import db from '../models/index'
import bcrypt from 'bcryptjs';
import { use } from 'express/lib/router';
const salt = bcrypt.genSaltSync(10);



let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hasUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                address: data.address,
                phonenumber: data.phonenumber,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })
            resolve('success create new user')
        } 
        catch (err) {
            reject(err);
        }
    })
}

let getAllUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try{
            let users = await db.User.findAll({
                raw: true
            })
            resolve(users)
        }catch(err){
            reject(err);
        }
    })

}

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

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where : {id: userId}
            });
            if(user){

                resolve(user)
            }else(
                resolve([])
            )
        }catch(err){
            reject(err)
        }
    })
}

let updateUserData =(data) =>{
    return new Promise(async (resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where: {id: data.id}
            })
            if(user){
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address
                await user.save()
                let allUsers = await db.User.findAll()
                resolve(allUsers)
            }
        }catch(err){

        }
    })
}   

let deleteUserById = (id)=>{
    return new Promise(async (resolve, reject) => {
        try{
            let userDeleta = await db.User.findOne({
                where: {id: id}
            })
            if(userDeleta){
                await userDeleta.destroy()
            }
            resolve()
        }catch(err){
            reject(err)
        }
    })
}
module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
} 
