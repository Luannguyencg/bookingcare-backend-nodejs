import db from '../models/index'
import doctorService from '../services/doctorService'

class DoctorController{

    async getTopDoctorHome (req, res){
        let limit = req.query.limit
        if(!limit){
            limit = 10
        }
        try{
            let doctor = await doctorService.getTopDoctorHome(+limit)
            return res.status(200).json(doctor)
        }catch(e){
            return res.status(200).json({
                errCode: -1,
                errMessage: 'error from server'
            })
        }
    }

    async getAllDoctor (req,res){
        try{
            let doctors = await doctorService.getAllDoctor()

            return res.status(200).json(doctors)
        }catch(e){
            return res.status(200).json({
                errCode: -1,
                errMessage: 'error from server'
            })
        }
    }

    async postInfoDoctor (req,res){
        try{
            let infoDoctor = await doctorService.postInfoDoctor(req.body)
          
            return res.status(200).json(infoDoctor)
        }catch(e){
            return res.status(200).json({
                errCode: -2,
                errMessage: 'error from server'
            })
        }
    }

    async getInfoDoctor (req, res){
        try{
            let response = await doctorService.getInfoDoctor(req.query.id)
            
            return res.status(200).json(response)
        }
        catch(e){
            
            return res.status(200).json({
                errCode: -1,
                errMessage: 'error from server'
            })
        }
    }
    
    async getInfoMarkdownDoctor (req, res){
        try{
            let response = await doctorService.getInfoMarkdownDoctor(req.query.id)
            
            return res.status(200).json(response)

        }catch(e){
            return res.status(200).json({
                errCode: -1,
                errMessage: 'error from server'
            })
        }
    }

    async editInfoMarkdownDoctor (req, res){
        try{
            let response = await doctorService.editInfoMarkdownDoctor(req.body)

            return res.status(200).json(response)
        }catch(e){
            return res.status(200).json({
                errCode: -1,
                errMessage: 'error from server'
            })
        }
    }

    async bulkCreateSchedule (req, res) {
        try {
            let data = await doctorService.bulkCreateSchedule(req.body)
            return res.status(200).json(data)
        }catch(e){
            return res.status(200).json({
                errCode: -1,
                errMessage: 'err from server'
            })
        }
    }

    async getScheduleDoctorByDate (req, res) {
        try{
          
            let data = await doctorService.getScheduleDoctorByDate(req.query.date, req.query.doctorId)
            return res.status(200).json(data)
        }catch(e){
            return res.status(200).json({
                errCode: -1,
                errMessage: 'err from server'
            })
        }
    }
    async saveDoctorInfo (req, res) {
        try{
           
            let data = await doctorService.saveDoctorInfo(req.body)
            return res.status(200).json(data)
        }catch(e){
            return res.status(200).json({
                errCode: -1,
                errMessage: 'err from server' 
            })
        }
    }
    async getDoctorInfoById (req, res) {
        try{
        
            let data = await doctorService.getDoctorInfoById(req.query.id)
            return res.status(200).json(data)
        }catch(e){
            return res.status(200).json({
                errCode: -1,
                errMessage: 'err from server' 
            })
        }
    }
   
    async getProfileDoctorById (req, res) {
        try{
          
            let data = await doctorService.getProfileDoctorById(req.query.id)
            return res.status(200).json(data)
        }catch(e){
            return res.status(200).json({
                errCode: -1,
                errMessage: 'err from server' 
            })
        }
    }
    async getListPatientforDoctor (req, res) {
        try{
            let data = await doctorService.getListPatientforDoctor(req.query.doctorId, req.query.date)
            return res.status(200).json(data)
        }catch(e){
            return res.status(200).json({
                errCode: -1,
                errMessage: 'err from server' 
            })
        }
    }
    async sendRemedy (req, res) {
        try{
            let data = await doctorService.sendRemedy(req.body)
            return res.status(200).json(data)
        }catch(e){
            return res.status(200).json({
                errCode: -1,
                errMessage: 'err from server' 
            })
        }
    }

}



module.exports = new DoctorController