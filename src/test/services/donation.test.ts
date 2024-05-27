import chai from 'chai';
import sinon from 'sinon';
import { ObjectId } from 'mongodb';
import Donation from "../../model/donation";
import mongoSetup from "../mongoSetup";
import {afterEach} from "mocha";
import {DonationSaveDto} from "../../dto/donation/donationSaveDto";
import * as donationService from 'src/services/donation';

const { expect } = chai;

const sandbox = sinon.createSandbox();

const donation1 = new Donation({
    _id: new ObjectId(),
    songId: 1,
    amount: 100,
    donor: {
        name: 'John',
        email: 'john@email.com'
    },
    timestamp: Date.now(),
});

const donation2 = new Donation({
    _id: new ObjectId(),
    songId: 1,
    amount: 50,
    donor: {
        name: 'Jaroslava',
        email: 'shdwrazedev@gmail.com'
    },
    timestamp: Date.now(),
});

const donation3 = new Donation({
    _id: new ObjectId(),
    songId: 2,
    amount: 50,
    donor: {
        name: 'Jaroslava',
        email: 'shdwrazedev@gmail.com'
    },
    timestamp: Date.now(),
});

describe('Donation Service', () => {
    before(async () => {
        /**
         * The mongoSetup promise is resolved when the database is ready to be used.
         * After it is resolved we can save all the needed data.
         */
        await mongoSetup;

        await donation1.save();
        await donation2.save();
        await donation3.save();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('createDonation should create a new donation and return its id', (done) => {
        const donationDto: DonationSaveDto = {
            songId: donation1.songId,
            amount: donation1.amount,
            donor: { ...donation1.donor },
        };

        donationService.createDonationRecord(donationDto)
            .then(async (id) => {
                const donation = await Donation.findById(id);

                expect(donation).to.exist;
                expect(donation?.songId).to.equal(donationDto.songId);
                expect(donation?.amount).to.equal(donationDto.amount);
                expect(donation?.donor).to.equal(donationDto.donor);

                done();
            })
            .catch((error: Error) => done(error));
    });
})