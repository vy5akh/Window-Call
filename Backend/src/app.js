import express from "express";
import {createServer} from  "node:http";
import {Server} from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { Socket } from "node:dgram";
import { connectToSocket } from "./controllers/socketManger.js";

import userRoutes from "./routes/usersRoute.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port",(process.env.PORT || 8080));

app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb", extended: true}));
app.use("/api/v1/users",userRoutes);


app.get("/home",(req,res)=>{
    return res.json({"heloo":"world"})
});
const start=  async () =>{
    const connectionDb = await mongoose.connect("mongodb+srv://kithu367:vysakh367@cluster0.jdq5uxw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

    console.log(`mongo connected DB  host:${connectionDb.connection.host}`);
    

        server.listen(8080,()=>{
            console.log("Listening .... on port 8080");
            
        })

}


start();