import db from '../models/index'
import patientService from '../services/patientService'
import specialtyService from '../services/specialtyService'
class SpecialtyController {
    async createNewSpecialty(req, res) {
        try {
            let data = await specialtyService.createNewSpecialty(req.body)
            return res.status(200).json(data)
        } catch (e) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'err from server!!'
            })
        }

    }
    async getAllspecialty(req, res) {
        try {

            let data = await specialtyService.getAllspecialty(req.query.id)
            return res.status(200).json(data)
        } catch (e) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'err from server!!'
            })
        }

    }

    async handleDeleteSpecialty(req, res) {
        try {
            if (req.body.id) {

                let data = await specialtyService.handleDeleteSpecialty(req.body.id)
                return res.status(200).json(data)
            }

        } catch (e) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'err from server!!'
            })
        }

    }

    async handleEditSpecialty(req, res) {
        try {


            let data = await specialtyService.handleEditSpecialty(req.body)
            return res.status(200).json(data)


        } catch (e) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'err from server!!'
            })
        }

    }

    async getDetailSpecialtyById (req, res){
        try{
            let data = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location)

            return res.status(200).json(data)
        } catch (e){
            console.log('check eerrr', e)
            return res.status(200).json({
                errCode: 1,
                errMessage: 'err from server!!'
            })
        }
    }



}



module.exports = new SpecialtyController