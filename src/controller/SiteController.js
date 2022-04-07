import db from '../models/index'
import CRUDService from '../services/CRUDService';
class SiteController{

    async getHomePage (req, res) {

        try{
            let data = await db.User.findAll();
           
            return res.render('homepage.ejs', {
                data: JSON.stringify(data)
            })

        }catch(e){
            console.log(e)

        }
        
    }

    getCRUD (req, res) {
        return res.render('CRUD.ejs')
    }


    async postCRUD (req, res){
       const message = await CRUDService.createNewUser(req.body)
        console.log(message)
       return res.send('hello from postCRUD')
    }

    async displayCRUD (req,res){
        let data = await CRUDService.getAllUser()
       
        return res.render('displayCRUD.ejs',{
            data: data
        })
    }

    async editCRUD (req, res){

        let userId = req.query.id
        if(userId){
            let userData = await CRUDService.getUserInfoById(userId)

            //check user data not found

            
            return(res.render('editCRUD.ejs',{

                user : userData
            }
            ) )
        }else{
            return res.send('user not found')

        }
        
    }

    async putCRUD (req, res){
        let data =  req.body
        console.log('>>>>>>>')
        console.log(data)
        let allUser = await CRUDService.updateUserData(data)
        return res.render('displayCRUD.ejs',{
            data: allUser
        })
    }

    async deleteCRUD (req, res){
        let id = req.query.id
        if(id){

            await CRUDService.deleteUserById(id)
            return res.send('deleteCRUD succsess')
        }else{
            return res.send('user not found')
        }
    }


}



module.exports = new SiteController