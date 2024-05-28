import { expect } from 'chai';
import sinon from 'sinon';
import chai from 'chai';
import express from "express";
import routers from "../../routers";
import bodyParser from 'body-parser';
import {afterEach} from "mocha";
import {ObjectId} from "mongodb";
import Donation from "../../model/donation";
import chaiHttp from "chai-http";
import mongoSetup from "../mongoSetup";

chai.use(chaiHttp);
chai.should();

const sandbox = sinon.createSandbox();

const app = express();

app.use(bodyParser.json({ limit: '1mb' }));
app.use('/', routers);

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

const donationsForSearch = [
    {
        _id: donation2._id.toString(),
        songId: donation2.songId,
        donorName: donation2.donor.name,
        amount: donation2.amount,
        timestamp: donation2.timestamp.toJSON()
    },
    {
        _id: donation1._id.toString(),
        songId: donation1.songId,
        donorName: donation1.donor.name,
        amount: donation1.amount,
        timestamp: donation1.timestamp.toJSON()
    },
];

describe('Donation controller', () => {

    before(async () => {
        await mongoSetup;

        await donation1.save();
        await donation2.save();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should save the donation', (done) => {
        const donationIdAfterSave = new ObjectId();
        const donation = {
            songId: 2,
            amount: 100,
            donor: {
                name: 'Name',
                email: 'email@email.com'
            }
        }

        const saveOneStub = sandbox.stub(
            Donation.prototype,
            'save'
        );
        saveOneStub.resolves({
            ...donation,
            _id: donationIdAfterSave,
        });

        chai.request(app)
            .post('/api/donation')
            .send({...donation})
            .end((_, res) => {
                res.should.have.status(201);
                expect(res.body.id).to.equal(donationIdAfterSave.toString());

                done();
            });
    });

    it('should list the donations by song id', (done) => {
        const songId = 1;

        chai.request(app)
            .get('/api/donation')
            .query({ songId, from: 0, size: 10 })
            .end((_, res) => {
                res.should.have.status(200);
                expect(res.body).to.deep.equal(donationsForSearch);

                done();
            });
    });

    it('should count donations for given song ids', (done) => {
        const songIds = [1];

        chai.request(app)
            .post('/api/donation/_counts')
            .send({ songIds })
            .end((_, res) => {
                res.should.have.status(200);
                expect(res.body).to.deep.equal({
                    1: 2,
                });
                done();
            });
    });
});