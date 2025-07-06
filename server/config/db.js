import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('✅ MongoDB connected')
    } catch (error) {
        console.error('❌ MongoDB connection error:', error)
        setTimeout(connectDB, 5000)
    }
}