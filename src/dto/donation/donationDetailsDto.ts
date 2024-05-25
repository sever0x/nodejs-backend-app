export interface DonationDetailsDto {
    _id: string,
    songId: number;
    donorName: string;
    amount: number;
    timestamp: Date;
}