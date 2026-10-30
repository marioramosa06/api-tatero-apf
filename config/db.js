const mongoose= require("mongoose")
const db_connect = async (mongodburi) => {
    try{
        await mongoose.connect(mongodburi)
        console.log("✓ mongodb connected")
    } catch(err){
        console.log("× mongodb connection failed : ", err.message)
        process.exit(1)
    }
}
module.exports = db_connect