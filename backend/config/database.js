import mongoose from "mongoose";

const Connection = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Database connect successfully");
    } catch (error) {
        console.log("Database not connect", error.message);
    }
};

export default Connection;
