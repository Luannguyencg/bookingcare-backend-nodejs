import express from "express";
import SiteController from '../controller/SiteController'
import UserController from '../controller/UserController'
import DoctorController from '../controller/DoctorController'
import PatientControler from '../controller/PatientController'
import SpecialtyController from '../controller/SpecialtyController'
import ClinicController from '../controller/ClinicController'

let router = express.Router();

let initWebRoutes = (app)=>{

    router.get('/', SiteController.getHomePage)
    router.get('/CRUD', SiteController.getCRUD)
    
    //
    router.post('/post-CRUD', SiteController.postCRUD)
    router.get('/get-CRUD', SiteController.displayCRUD)
    router.get('/edit-CRUD', SiteController.editCRUD)

    //
    router.post('/put-CRUD', SiteController.putCRUD)
    router.get('/delete-CRUD', SiteController.deleteCRUD)
    
    router.post('/api/login', UserController.handleLogin)
    router.get('/api/get-all-user', UserController.handleGetAllUser)
    router.post('/api/create-new-user', UserController.handleCreateNewUser)
    router.put('/api/edit-user', UserController.handleEditUser)
    router.delete('/api/delete-user', UserController.handleDeleteUser)
    
    
    router.get('/api/allcode', UserController.getAllCode)
    
    router.get('/api/top-doctor-home', DoctorController.getTopDoctorHome)

    router.get('/api/all-doctor', DoctorController.getAllDoctor)
    
    router.post('/api/save-info-doctor', DoctorController.postInfoDoctor)
    router.put('/api/edit-info-markdown', DoctorController.editInfoMarkdownDoctor)
    
    

    router.get('/api/get-info-doctor-by-id', DoctorController.getInfoDoctor)

    router.get('/api/get-info-markdown', DoctorController.getInfoMarkdownDoctor)

    router.post('/api/bulk-create-schedule', DoctorController.bulkCreateSchedule)
    
    router.post('/api/save-doctor-info', DoctorController.saveDoctorInfo)
    router.get('/api/doctor-info-by-id', DoctorController.getDoctorInfoById)
    

    router.get('/api/get-list-patient-for-doctor', DoctorController.getListPatientforDoctor)
    router.post('/api/send-remedy', DoctorController.sendRemedy)
    

    router.get('/api/schedule-doctor-by-date', DoctorController.getScheduleDoctorByDate)
    router.get('/api/profile-doctor-by-id', DoctorController.getProfileDoctorById)
    
    router.post('/api/patient-book-appoinment', PatientControler.postBookAppoinment)
    router.post('/api/veryfi-book-appoinment', PatientControler.postVeryfiBookAppoinment)
   
    router.post('/api/create-new-specialty', SpecialtyController.createNewSpecialty)
    router.get('/api/get-all-specialty', SpecialtyController.getAllspecialty)
    router.delete('/api/delete-specialty', SpecialtyController.handleDeleteSpecialty)
    router.put('/api/update-edit-specialty', SpecialtyController.handleEditSpecialty)
    router.get('/api/get-detail-specialty-by-id', SpecialtyController.getDetailSpecialtyById)
    
    router.post('/api/create-new-clinic', ClinicController.createNewClinic)
    router.get('/api/get-all-clinic', ClinicController.getAllClinic)
    router.delete('/api/delete-clinic', ClinicController.handleDeleteClinic)
    router.put('/api/update-edit-clinic', ClinicController.handleEditClinic)
    router.get('/api/get-detail-clinic-by-id', ClinicController.getDetailClinicById)
    
    return app.use("/", router);
} 

export default initWebRoutes