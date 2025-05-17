import httpStatus from "http-status";
import { User } from "../models/userModels.js";
import bcrypt, { hash } from "bcrypt"

import crypto from "crypto"
import { Meeting } from "../models/meetingModel.js";
const login = async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please Provide" })
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" })
        }


        let isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token })
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or password" })
        }

    } catch (e) {
        return res.status(500).json({ message: `Something went wrong ${e}` })
    }
}


const register = async (req, res) => {
    const { name, username, password } = req.body;


    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({ message: "User Registered" })

    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }

}


const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
        const meetings = await Meeting.find({ user_id: user.username })
        res.json(meetings)
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token: token });

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}


export { login, register, getUserHistory, addToHistory }



// import httpStatus from "http-status";
// import {User} from "../models/userModels.js";
// import crypto from "crypto";
// import bcrypt ,{hash} from "bcrypt";

// const login =async( req, res)=>{
//     const {username,password}=req.body;
//     if(!username || !password){
//         return res.status(404).json({message:"Please provide"})
//     }
//     try{
//         const user = await User.findOne({username});
//         if(!user){
//             return res.status(httpStatus.NOT_FOUND).json({message:"User not found"});
//         }


//         let isPassword = await bcrypt.compare(password, user.password)
//         if(isPassword){
//             let token = crypto.randomBytes(20).toString("hex");
//             user.token = token;
//             await user.save();
//             return res.status( httpStatus.OK).json({token:token});
//         }else{
//             return res.status(httpStatus.UNAUTHORIZED).json({message:"Invalid Username or Password"})
//         }
//     }catch(e){ 
//         return res.status(500).json({message:`Something went wrong ${e}`})
//     }
// }
// const register = async(req, res)=>{
//     const {name, username,password} = req.body;
//     try {
//         const exisitingUser = await  User.findOne({username});
//         if(exisitingUser){
//             return res.status(httpStatus.FOUND).json({message:"user alread exists"});
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({
//             name :name,
//             username: username,
//             password:hashedPassword
//         });

//         await newUser.save();
//         res.status(httpStatus.CREATED).json({message:"User registered"});
//     } catch (e) { 
//         res.json({
//             message:`Something went wrong ${e}`
//         });
        
//     }
// }

// export {login,register};