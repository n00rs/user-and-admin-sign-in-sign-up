const db = require("./connect");
const bcrypt = require("bcrypt");
const objectId = require('mongodb').ObjectId

module.exports = {
    adminSignup: (adminData) => {
        let error = "Admin Id Already Exists"
        return new Promise(async (resolve, reject) => {
            let admin = await db.get().collection('admin_3').findOne({ email: adminData.email });
            if (!admin) {

                adminData.password = await bcrypt.hash(adminData.password, 10);
                db.get().collection('admin_3').insertOne(adminData).then((response) => {           //admin_3 collection name
                    resolve(response);
                })
            } else {
                reject(error);
            }
        })
     },

    adminLogin: (loginData) => {
        let response = {};
        return new Promise(async (resolve, reject) => {
            let admin = await db.get().collection('admin_3').findOne({ email: loginData.email })
            if (admin) {
                bcrypt.compare(loginData.password, admin.password).then((status) => {
                    if (status) {
                        response.admin = admin;
                        response.status = true;
                        resolve(response);
                    } else {
                        resolve({ status: false })
                    }
                })
            } else {
                resolve({ status: false })
            }
        })
     },

    getUsers: () => {
        return new Promise((resolve, reject) => {
            let user = db.get().collection('user3').find().toArray()
            resolve(user)
        })
    },

    deleteUsers: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection('user3').deleteOne({_id:objectId(userId)}).then((response) => {
                resolve(response)
            })
        })
    },
    
    getUser: (userId) => {
        return new Promise( async (resolve, reject) => {
            await db.get().collection('user3').findOne({_id:objectId(userId)}).then((userData) => {
                resolve(userData);
            })
        })
    },

    updateUser: (updateData) => {
        return new Promise((resolve, reject) => {
            db.get().collection("user3").updateOne({_id: objectId(updateData.id)},
            {$set:{
                name: updateData.fname,
                sname: updateData.sname,
                age: updateData.age                  
            }
            }).then((response) =>{
                resolve(response);
            })
        })
    }
}