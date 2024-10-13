// import mongoose from "mongoose";
 
// export default async function connect() {
//    try {
//        mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI!)
//        const connection = mongoose.connection;

//        connection.on('connected', () => {
//            console.log("Mongo db connected successfully!");
//        });

//        connection.on('error', (err) => {
//            console.log("Mongo db connection error. Please try connecting again. " + err)
//            process.exit();
//        });
//    } catch (error) {
//        console.log("Mongo db connection error");
//        console.log(error);
       
       
//    }
// }

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionUrl: string = process.env.NEXT_PUBLIC_MONGODB_URI as string;
        mongoose.connect(connectionUrl);
        const connection = mongoose. connection
        console.log("DB connected succesfully.");
        return connection;
    } catch (error) {
        console.log("DB connection Error :", error);
    }
}



// connecting to database
// const connectDB = async () => {
//     const connectionUrl: string = process.env.NEXT_PUBLIC_MONGODB_URI as string;
//     mongoose.connect(connectionUrl , options )
//         .then(() => console.log(`Database connected successfully`))
//         .catch((err) => console.log("Getting Error from DB connection" + err.message))
//     mongoose.set('strictQuery', false);
// };

export default connectDB;   