
import clinicService from '../services/clinicService'
class SpecialtyController {
    async createNewClinic(req, res) {
        try {
            let data = await clinicService.createNewClinic(req.body)
            return res.status(200).json(data)
        } catch (e) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'err from server!!'
            })
        }

    }
    async getAllClinic(req, res) {
        try {
            let data = await clinicService.getAllClinic(req.query.id)

            return res.status(200).json(data)
        } catch (e) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'err from server!!'
            })
        }

    }

    async handleDeleteClinic(req, res) {
        try {
            if (req.body.id) {

                let data = await clinicService.handleDeleteClinic(req.body.id)
                return res.status(200).json(data)
            }

        } catch (e) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'err from server!!'
            })
        }

    }

    
    async handleEditClinic(req, res) {
        try {
            let data = await clinicService.handleEditClinic(req.body)
            return res.status(200).json(data)
        } catch (e) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'err from server!!'
            })
        }

    }

    async getDetailClinicById (req, res){
        try{
            let data = await clinicService.getDetailClinicById(req.query.id, req.query.location)

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