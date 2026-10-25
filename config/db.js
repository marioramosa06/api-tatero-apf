const mongoose= require("mongoose")
const db_connect = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("✓ mongodb connected")
    } catch(err){
        console.log("× mongodb connection failed : ", err.message)
        process.exit(1)
    }
}
module.exports = db_connect