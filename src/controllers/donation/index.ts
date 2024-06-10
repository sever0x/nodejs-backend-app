import {DonationSaveDto} from "src/dto/donation/donationSaveDto";
import { Request, Response } from 'express';
import {
    createDonationRecord as createDonationRecordApi,
    getDonationsBySongId as searchApi,
    countDonationsBySongsIds as countApi,
} from "src/services/donation";
import httpStatus from "http-status";
import {InternalError} from "../../system/internalError";
import log4js from "log4js";
import {DonationQueryDto} from "../../dto/donation/donationQueryDto";
import {DonationCountsDto} from "../../dto/donation/donationCountsDto";
import {sendMessage} from "../../producer";
import {DONATION_EMAIL_TEMPLATE} from "../../templates";

export const saveDonation = async (req: Request, res: Response) => {
    try {
        const donation = new DonationSaveDto(req.body);
        const donationDetails = await createDonationRecordApi({
            ...donation,
        });

        const emailMessage = {
            subject: 'New Donation',
            content: DONATION_EMAIL_TEMPLATE
                .replace('{donorName}', donationDetails.donorName)
                .replace('{donationAmount}', donationDetails.amount.toString())
                .replace('{songId}', donationDetails.songId.toString())
                .replace('{donorEmail}', donation.donor?.email ?? ''),
            recipients: [donation.donor?.email]
        };
        await sendMessage(emailMessage);

        res.status(httpStatus.CREATED).send(donationDetails);
    } catch (err) {
        const { message, status } = new InternalError(err);
        log4js.getLogger().error('Error in creating donation record', err);
        res.status(status).send({ message });
    }
}

export const search = async (req: Request, res: Response)=> {
    try {
        const query = new DonationQueryDto(req.query);
        const result = await searchApi(query);

        res.send(result);
    } catch (err) {
        const { message, status } = new InternalError(err);
        log4js.getLogger().error(`Error in searching donations.`, err);
        res.status(status).send({ message });
    }
}

export const count = async (req: Request, res: Response) => {
    try {
        const donationCount = new DonationCountsDto(req.body);
        const result = await countApi(donationCount);
        res.send(result);
    } catch (err) {
        const { message, status } = new InternalError(err);
        log4js.getLogger().error(`Error in counting donations.`, err);
        res.status(status).send({ message });
    }
}