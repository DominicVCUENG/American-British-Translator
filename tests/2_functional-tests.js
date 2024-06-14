const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    // Test for valid translation request with both text and locale
    test('Translation with text and locale fields: POST request to /api/translate', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({
                text: "Mangoes are my favorite fruit.",
                locale: "american-to-british"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.translation, 'Mangoes are my <span class="highlight">favourite</span> fruit.');
                done();
            });
    });

    // Test for invalid locale field
    test('Translation with text and invalid locale field: POST request to /api/translate', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({
                text: "Mangoes are my favorite fruit.",
                locale: "american-to-french"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Invalid value for locale field' });
                done();
            });
    });

    // Test for missing text field
    test('Translation with missing text field: POST request to /api/translate', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({
                locale: "american-to-british"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Required field(s) missing' });
                done();
            });
    });

    // Test for missing locale field
    test('Translation with missing locale field: POST request to /api/translate', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({
                text: "Mangoes are my favorite fruit."
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'Required field(s) missing' });
                done();
            });
    });

    // Test for empty text field
    test('Translation with empty text: POST request to /api/translate', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({
                text: "",
                locale: "american-to-british"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'No text to translate' });
                done();
            });
    });

    // Test for text that needs no translation
    test('Translation with text that needs no translation: POST request to /api/translate', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({
                text: "Mangoes are delicious.",
                locale: "american-to-british"
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.translation, "Everything looks good to me!");
                done();
            });
    });
});