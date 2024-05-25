import {DonationSaveDto} from "src/dto/donation/donationSaveDto";
import { Request, Response } from 'express';
import {
    createDonationRecord as createDonationRecordApi,
    getDonationsBySongId as searchApi
} from "src/services/donation";
import httpStatus from "http-status";
import {InternalError} from "../../system/internalError";
import log4js from "log4js";
import {DonationQueryDto} from "../../dto/donation/donationQueryDto";

export const saveDonation = async (req: Request, res: Response) => {
    try {
        const donation = new DonationSaveDto(req.body);
        const id = await createDonationRecordApi({
            ...donation,
        });
        res.status(httpStatus.CREATED).send({
            id,
        });
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

        res.send({ result, });
    } catch (err) {
        const { message, status } = new InternalError(err);
        log4js.getLogger().error(`Error in searching donations.`, err);
        res.status(status).send({ message });
    }
}