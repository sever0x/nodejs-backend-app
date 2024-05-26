export class DonationCountsDto {
    songIds?: number[]


    constructor(data: Partial<DonationCountsDto>) {
        this.songIds = data.songIds;
    }
}