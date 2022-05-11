import { userService } from "../services/services.js";

//POST new user
const saveUser = async(req, res) => {
    let { first_name, last_name, email, phone, password, role, profile_picture} = req.body;
    await userService.save({first_name, last_name, email, phone, password, role, profile_picture}).then(user => {
        res.send({status:"success", message:'User saved.'});
    })
}

//GET user by ID
const getUserById = async(req, res) => {
    let id = req.params.uid;
    let user = await userService.getBy({_id:id});
    if(!user) res.status(404).send({status:'error', message:`User not found.`});
    res.send({status:'success', payload:user});
}

//GET all users
const getAllUsers = async(req, res) => {
    let users = await userService.getAll();
    res.send(users);
}

//DELETE user
const deleteUser = async(req, res) => {
    let { uid } = req.params;
    let user = await userService.getBy({_id:uid});
    //Check if user exists
    if(!user) res.status(404).send({status:'error', error:`User doesn't exist.`});
    await userService.delete(uid);
    res.send({status:'success', message: 'User deleted from db.'});
}

export{
    saveUser,
    getUserById,
    getAllUsers,
    deleteUser
}