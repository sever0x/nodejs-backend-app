import {DonationSaveDto} from "src/dto/donation/donationSaveDto";
import { Request, Response } from 'express';
import {
    createDonationRecord as createDonationRecordApi
} from "src/services/donation";
import httpStatus from "http-status";
import {InternalError} from "../../system/internalError";
import log4js from "log4js";

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