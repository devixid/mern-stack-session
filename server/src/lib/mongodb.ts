import mongoose from "mongoose";

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
    } catch (error: any) {
        throw new Error(error);
    }
}
