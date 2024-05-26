import {DonationSaveDto} from "src/dto/donation/donationSaveDto";
import Donation, {IDonation} from "src/model/donation";
import config from "../../config";
import {DonationQueryDto} from "../../dto/donation/donationQueryDto";
import {DonationDetailsDto} from "../../dto/donation/donationDetailsDto";
import {DonationCountsDto} from "../../dto/donation/donationCountsDto";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const createDonationRecord = async (
    donationDto: DonationSaveDto
): Promise<string> => {
    await validateDonationRequest(donationDto);
    const donation = await new Donation(donationDto).save();
    return donation._id;
}


export const getDonationsBySongId = async (
    query: DonationQueryDto
): Promise<DonationDetailsDto[]> => {
    const songIdString = query.songId;
    if (!songIdString) {
        throw new Error(`SongId is required`);
    }

    const songId = parseInt(songIdString, 10);
    if (isNaN(songId)) {
        throw new Error(`SongId must be a valid number`);
    }

    const donations = await Donation
        .find({
            ...(songId && { songId }),
        })
        .sort({ timestamp: -1 })
        .skip(query.from)
        .limit(query.size);

    return donations.map(donation => toDetailsDto(donation));
}

export const countDonationsBySongsIds = async (
    donationDto: DonationCountsDto
): Promise<Record<number, number>> => {
    const { songIds } = donationDto;
    const result = await Donation.aggregate([
        { $match: { songId: { $in: songIds } } },
        { $group: { _id: "$songId", count: { $sum: 1 } } },
    ]);

    return result.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
    }, {});
}

const toDetailsDto = (donation: IDonation): DonationDetailsDto => {
    return ({
        _id: donation._id,
        songId: donation.songId,
        donorName: donation.donor.name,
        amount: donation.amount,
        timestamp: donation.timestamp,
    });
};

const validateDonationRequest = async (donationDto: DonationSaveDto) => {
    const { donor, songId, amount } = donationDto;

    if (donor?.name == null || donor?.name === '') {
        throw new Error(`Donor name can't be null or empty`);
    }
    if (donor?.email) {
        if (!emailRegex.test(donor?.email)) {
            throw new Error(`Donor email is invalid - ${donor?.email}`);
        }
    } else throw new Error(`Donor email can't be null or empty`);

    if (songId) {
        await validateSongExists(songId);
    }

    if (amount && amount <= 0) {
        throw new Error(`Amount can't be equal to or less than 0`);
    }
};

const validateSongExists = async (songId: number) => {
    try {
        const response = await fetch(`${config.backendExternal.url}${config.backendExternal.mapping.song}/${songId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Unable to verify song existence: ${error.message}`);
        }
    }
};
