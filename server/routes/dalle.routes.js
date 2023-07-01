import express from 'express';
import * as dotenv from 'dotenv';
import { Configuration,OpenAIApi } from 'openai';
import axios from 'axios';

dotenv.config();

const router = express.Router();

const config = new Configuration({
    apiKey:process.env.OpenAI_API_KEY
})

const openai = new OpenAIApi(config);

router.route("/").get((req,res)=>{
    res.status(200).json({message: "Hello from Dall.e Routes"})
})

router.route('/').post(async (req,res)=>{
    try{
        const {prompt} = req.body;
        const encodedQuery = encodeURIComponent(prompt);
        const url = `https://lexica.art/api/v1/search?q=${encodedQuery}`;
        const response = await axios.get(url);
        if(response.status === 200){
            const data = response.data;

            if(data.images && data.images.length>0){
                var x = 0;
                if(data.images.length>10){
                    x=Math.floor(Math.random() * 11);
                }
                const image = data.images[x];
                res.json({photo:image.src})
            }
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Something went Wrong"})
    }
})

export default router;