import { ObjectId } from 'mongodb';
import Donation from "../../model/donation";
import mongoSetup from "../mongoSetup";
import {afterEach} from "mocha";
import {DonationSaveDto} from "../../dto/donation/donationSaveDto";
import * as donationService from "../../services/donation"

import { expect } from 'chai';
import sinon from 'sinon';
import {DonationCountsDto} from "../../dto/donation/donationCountsDto";
import {DonationQueryDto} from "../../dto/donation/donationQueryDto";

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

const donationForSearch = new Donation({
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
        await donationForSearch.save();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('countDonationsBySongsIds should return donation counts for given songIds', (done) => {
        const dto: DonationCountsDto = { songIds: [1, 2] };
        donationService.countDonationsBySongsIds(dto)
            .then((counts) => {
                expect(counts).to.have.property('1', 4);
                expect(counts).to.have.property('2', 1);
                done();
            })
            .catch((error: Error) => done(error));
    });

    it('createDonation should create a new donation and return its id', (done) => {
        const validateDonationRequestStub = sandbox.stub(donationService, 'validateDonationRequest');
        const donationDto: DonationSaveDto = {
            songId: donation1.songId,
            amount: donation1.amount,
            donor: {
                name: donation1.donor.name,
                email: donation1.donor.email
            },
        };

        donationService.createDonationRecord(donationDto)
            .then(async (id) => {
                sandbox.assert.calledOnce(validateDonationRequestStub);
                const validationArgs = validateDonationRequestStub.getCall(0).args;
                expect(validationArgs[0]).to.eql(donation1);

                const donation = await Donation.findById(id);

                expect(donation).to.exist;
                expect(donation?.songId).to.equal(donationDto.songId);
                expect(donation?.amount).to.equal(donationDto.amount);
                expect(donation?.donor.name).to.equal(donationDto.donor?.name);
                expect(donation?.donor.email).to.equal(donationDto.donor?.email);

                done();
            })
            .catch((error: Error) => done(error));
    });

    it('getDonationsBySongId should return donations for a valid songId', (done) => {
        const query: DonationQueryDto = new DonationQueryDto();
        query.songId = donationForSearch.songId.toString();
        donationService.getDonationsBySongId(query)
            .then((donations) => {
                expect(donations.length).to.equal(1);
                expect(donations[0]._id).to.eql(donationForSearch._id);
                done();
            })
            .catch((error: Error) => done(error));
    });

    it('getDonationsBySongId should throw an error for an invalid songId', (done) => {
        const query: DonationQueryDto = new DonationQueryDto();
        query.songId = 'invalid';
        donationService.getDonationsBySongId(query)
            .then(() => done(new Error('Expected an error')))
            .catch((error) => {
                expect(error.message).to.include('SongId must be a valid number');
                done();
            });
    });
});