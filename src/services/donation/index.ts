import {DonationSaveDto} from "src/dto/donation/donationSaveDto";
import Donation from "src/model/donation";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const createDonationRecord = async (
    donationDto: DonationSaveDto
): Promise<string> => {
    await validateDonationRequest(donationDto);
    const donation = await new Donation(donationDto).save();
    return donation._id;
}

export const validateDonationRequest = async (donationDto: DonationSaveDto) => {
    const { donor, songId, amount } = donationDto;

    if (donor?.name == null && donor?.name === '') {
        throw new Error(`Donor name can't be null or empty`);
    }
    if (donor?.email) {
        if (!emailRegex.test(donor?.email)) {
            throw new Error(`Donor email is invalid - ${donor?.email}`);
        }
    } else throw new Error(`Donor email can't be null or empty`);

    if (songId) {
        console.log("stub"); //todo
    }

    if (amount && amount <= 0) {
        throw new Error(`Amount can't be equal to or less than 0`)
    }
};