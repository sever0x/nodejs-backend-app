import {Donor} from "../donor/donor";

export interface DonationDetailsDto {
    songId: number;
    donor: Donor;
    amount: number;
    timestamp: Date;
}