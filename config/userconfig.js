const db = require("./connect");
const bcrypt = require("bcrypt");

module.exports = {
    doSignup: (signupData) => {
        let err = "email already exist";
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection('user3').findOne({email:signupData.email})

            if(!user){
                signupData.password = await bcrypt.hash(signupData.password, 10);
                db.get().collection('user3').insertOne(signupData).then((data) => {
                resolve(data)
            })
        }else reject(err)
        })
    },

    doLogin: (loginData) => {
        let loginStatus = false;
        let response = {};
        return new Promise(async (resolve, reject) => {
          let user = await db.get().collection('user3').findOne({email:loginData.email})

          if(user){
            bcrypt.compare(loginData.password,user.password).then((status) => {
                if(status){
                    response.user = user;
                    response.status = true ;
                    resolve(response) ;
                }else{
                    resolve({status:false}) ;
                }
            })
          }else{
            console.log('no user') ;
        resolve({status:false})}
        })   
    }

}