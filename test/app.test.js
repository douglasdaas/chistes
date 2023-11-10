const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, server } = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Chistes API', () => {
    after(() => {
        server.close();
    });

    describe('GET /chistes', () => {
        it('should return a random joke if no type is specified', (done) => {
            chai.request(app)
                .get('/chistes')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('chiste');
                    done();
                });
        });

        it('should return a Chuck Norris joke if type is "Chuck"', (done) => {
            chai.request(app)
                .get('/chistes?tipo=Chuck')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('chiste');
                    done();
                });
        });

        it('should return a Dad joke if type is "Dad"', (done) => {
            chai.request(app)
                .get('/chistes?tipo=Dad')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('chiste');
                    done();
                });
        });

        it('should return an error if an invalid type is specified', (done) => {
            chai.request(app)
                .get('/chistes?tipo=Invalid')
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('error');
                    done();
                });
        });
    });

    describe('POST /chistes', () => {
        it('should save a new joke and return success message', (done) => {
            chai.request(app)
                .post('/chistes')
                .send({ texto: 'This is a test joke' })
                .end((err, res) => {
                    if (err) {
                        done(err); // Asegúrate de llamar a done() con el error
                        return;
                    }
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('mensaje');
                    expect(res.body).to.have.property('chiste');
                    done();
                });
        });


        it('should return an error if "texto" field is missing', (done) => {
            chai.request(app)
                .post('/chistes')
                .send({})
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('error');
                    done();
                });
        });
    });

    describe('PUT /chistes/:number', () => {
        it('should update the text of a joke and return success message', (done) => {
            chai.request(app)
                .put('/chistes/1')
                .send({ texto: 'This is an updated joke' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('mensaje');
                    expect(res.body).to.have.property('chiste');
                    done();
                });
        });

        it('should return an error if joke with specified number is not found', (done) => {
            chai.request(app)
                .put('/chistes/999')
                .send({ texto: 'This is an updated joke' })
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('error');
                    done();
                });
        });

        it('should return an error if "texto" field is missing', (done) => {
            chai.request(app)
                .put('/chistes/1')
                .send({})
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('error');
                    done();
                });
        });
    });

    describe('DELETE /chistes/:number', () => {
        it('should delete a joke and return success message', (done) => {
            chai.request(app)
                .delete('/chistes/1')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('mensaje');
                    done();
                });
        });

        it('should return an error if joke with specified number is not found', (done) => {
            chai.request(app)
                .delete('/chistes/999')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('error');
                    done();
                });
        });
    });

    describe('GET /lcm', () => {
        it('should calculate the LCM of a list of numbers', (done) => {
            chai.request(app)
                .get('/lcm?numbers=2&numbers=3&numbers=4')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('mcm');
                    done();
                });
        });

        it('should return an error if less than 2 numbers are provided', (done) => {
            chai.request(app)
                .get('/lcm?numbers=2')
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('error');
                    done();
                });
        });
    });

    describe('GET /increment', () => {
        it('should increment a number by 1', (done) => {
            chai.request(app)
                .get('/increment?number=5')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('numeroIncrementado');
                    expect(res.body.numeroIncrementado).to.equal(6);
                    done();
                });
        });

        it('should return an error if number is missing', (done) => {
            chai.request(app)
                .get('/increment')
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('error');
                    done();
                });
        });
    });
});

