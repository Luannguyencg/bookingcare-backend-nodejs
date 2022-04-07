import db from '../models/index'
import patientService from '../services/patientService'

class PatientController{
    async postBookAppoinment (req, res){
        try{
            let data = await patientService.postBookAppoinment(req.body)
            return res.status(200).json(data)
        }catch(e){
            console.log('check err sever', e)
            return res.status(200).json({
                errCode: -1,
                errMessage: 'error from server'
            })
        }

    }
 
    async postVeryfiBookAppoinment (req, res){
        try{
            let data = await patientService.postVeryfiBookAppoinment(req.body)
            return res.status(200).json(data)
        }catch(e){
            console.log('check err sever', e)
            return res.status(200).json({
                errCode: -1,
                errMessage: 'error from server'
            })
        }

    }
 

}



module.exports = new PatientController