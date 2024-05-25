import {QueryDto} from "../queryDto";

export class DonationQueryDto extends QueryDto {

    songId?: string;

    constructor(query?: Partial<DonationQueryDto>) {
        super();
        if (query) {
            this.songId = query.songId;
            this.from = query.from || 0;
            this.size = query.size || 10;
        }
    }
}