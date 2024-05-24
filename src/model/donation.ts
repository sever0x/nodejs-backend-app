import mongoose, { Schema, Document } from 'mongoose';

export interface IDonor {
    name: string;
    email: string;
}

export interface IDonation extends Document {
    songId: number;
    amount: number;
    donor: IDonor;
    timestamp: Date;
}

const donorSchema = new Schema({
    name: String,
    email: String,
});

const donationSchema = new Schema({
    songId: { type: Number, required: true },
    amount: { type: Number, required: true },
    donor: { type: donorSchema, required: true },
    timestamp: { type: Date, default: Date.now() }
});

const Donation = mongoose.model<IDonation>('Donation', donationSchema);

export default Donation;