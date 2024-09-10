import express from 'express';
import DivSchema from '../model/DivSchema';
import mongoose from 'mongoose';

const router = express.Router();
const Divstation = mongoose.model('Divstation', DivSchema);

router.route('/')
.post(async(req,res)=>{
    try {
        const divstation = new Divstation(req.body);
        const savedDivstation = await divstation.save();
        res.json(savedDivstation);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}).get(async(req, res)=>{
    try {
        const divstation = await Divstation.find();
        res.json(divstation)
    } catch (error) {
        res.status(500).json({error: error.message});
        
    }
});

export default router;