require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})


describe('Message API endpoints', () => {
    beforeEach((done) => {
        // TODO: add any beforeEach code here
        const testMessage = new Message({
            title: "hello world", 
            body: "1 2 3 4 5",
            author: "johnny appleseed",
            _id: testID
        })
        testMessage.save()
        done()
    })

    afterEach((done) => {
        // TODO: add any afterEach code here
        Message.deleteOne({_id: testID})
        done()
    })

    it('should load all messages', (done) => {
        // TODO: Complete this
        chai.request(app)
        .get('/')
        .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body.msgs).to.be.an('array');
        done()
        })
    })

    it('should get one specific message', (done) => {
        chai.request(app)
        .get('/${testID}')
        .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body.title).to.equal('hello world');
            expect(res.body.body).to.equal('1 2 3 4 5');
            expect(res.body.author).to.equal('johnny appleseed')
        done()
        })
    })

    it('should post a new message', (done) => {
        chai.request(app)
        .post('/')
        .send({title: 'aloha zi', body: 'do re mi fa', author: 'scooby doo'})
        .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body.title).to.equal('aloha zi');
            expect(res.body.body).to.equal('do re mi fa');
            expect(res.body.author).to.equal('scooby doo')
        done()
        })
    })

    it('should update a message', (done) => {
        chai.request(app)
        .put('/${testID}')
        .send({title: 'bye world'})
        .end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body.title).to.equal('bye world');
            expect(res.body.body).to.equal('1 2 3 4 5');
            expect(res.body.author).to.equal('johnny appleseed')
        done()
        })
    })

    it('should delete a message', (done) => {
        chai.request(app)
        .delete(`/messages/${testID}`)
        .end((err, res) => {
            if (err) done(err);
            expect(res.body.message).to.equal('Message has been deleted');
            done();

            Message.findOne({ title: 'hello world' }).then((msg) => {
                expect(msg).to.equal(null);
                done();
            })
        })
    })
})