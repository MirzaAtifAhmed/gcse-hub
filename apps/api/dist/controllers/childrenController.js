import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { z } from 'zod';
import { User } from '../models/User.js';
import { toChildProfile } from '../utils/mappers.js';
const createChildSchema = z
    .object({
    firstName: z.string().min(2),
    surname: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    currentYear: z.number().min(7).max(11),
    target: z.enum(['foundation', 'higher', 'undecided']).default('undecided'),
})
    .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
const promoteSchema = z.object({
    currentYear: z.number().min(7).max(11),
});
export async function listChildren(req, res) {
    const children = await User.find({ parentId: req.user?.id, role: 'student' }).sort({
        createdAt: -1,
    });
    return res.json({ success: true, data: children.map(toChildProfile) });
}
export async function createChild(req, res) {
    const body = createChildSchema.parse(req.body);
    const exists = await User.exists({ email: body.email.toLowerCase() });
    if (exists) {
        return res.status(409).json({ success: false, message: 'Email is already registered' });
    }
    const passwordHash = await bcrypt.hash(body.password, 12);
    const name = `${body.firstName} ${body.surname}`;
    const child = await User.create({
        firstName: body.firstName,
        surname: body.surname,
        name,
        email: body.email,
        passwordHash,
        role: 'student',
        currentYear: body.currentYear,
        target: body.target,
        parentId: req.user?.id,
    });
    await User.findByIdAndUpdate(req.user?.id, { $addToSet: { linkedChildren: child._id } });
    return res.status(201).json({ success: true, data: toChildProfile(child) });
}
export async function promoteChild(req, res) {
    const body = promoteSchema.parse(req.body);
    const childId = req.params.childId;
    if (!mongoose.Types.ObjectId.isValid(childId)) {
        return res.status(400).json({ success: false, message: 'Invalid child id' });
    }
    const child = await User.findOneAndUpdate({ _id: childId, parentId: req.user?.id, role: 'student' }, { currentYear: body.currentYear }, { new: true });
    if (!child) {
        return res.status(404).json({ success: false, message: 'Child not found' });
    }
    return res.json({ success: true, data: toChildProfile(child) });
}
