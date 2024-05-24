import {Donor} from "../donor/donor";

export class DonationSaveDto {
    songId?: number;
    amount?: number;
    donor?: Donor;

    constructor(data: Partial<DonationSaveDto>) {
        this.songId = data.songId;
        this.amount = data.amount;
        this.donor = data.donor ? {
            name: data.donor.name,
            email: data.donor.email,
        } : undefined;
    }
}