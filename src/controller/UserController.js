import userService from '../services/userService'


class UserController {
    async handleLogin(req, res){
        let email = req.body.email
        let password = req.body.password

        if(!email || !password) {
            return res.status(500).json({
                errCode: 1,
                message: 'Missing inputs parameter!'
            })
        }
        let userData = await userService.handleUserLogin(email, password)
        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            user : userData.user ? userData.user : {}

        })
    }

    async handleGetAllUser (req,res) {
        let id = await req.query.id  //all, single

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters',
                user: []
            })
        }

        let user = await userService.getAllUser(id)
        
        return res.status(200).json({
            errCode: 0,
            errMessage: 'ok',
            user 
        })
    }


    async handleCreateNewUser(req,res){
        let message = await userService.createNewUser(req.body)
        return res.status(200).json(message)
    }

    async handleEditUser(req,res){
        let data =  req.body
       
        let message = await userService.updateUserData(data)
        return res.status(200).json(message)
    }

    async handleDeleteUser(req,res){
        if(!req.body.id){
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters'
            })
        }
        let message = await userService.deleteUser(req.body.id)
        return res.status(200).json(message)
    }

    async getAllCode (req, res){
        try{
            let data = await userService.getAllCodeService(req.query.type)
            
            return res.status(200).json(data)
        }catch(e){
            console.log('getAllCode',e)
            return res.status(200).json({
                errCode: -1,
                errMessage: 'err from server'
            })
        }

    }
}


module.exports = new UserController