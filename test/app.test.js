const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, server } = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('API de Chistes', () => {
    after(() => {
        server.close();
    });

    describe('GET /chistes', () => {
        it('debería devolver un chiste aleatorio si no se especifica un tipo', (done) => {
            chai.request(app)
                .get('/chistes')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('chiste');
                    done();
                });
        });

        it('debería devolver un chiste de Chuck Norris si el tipo es "Chuck"', (done) => {
            chai.request(app)
                .get('/chistes?tipo=Chuck')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('chiste');
                    done();
                });
        });

        it('debería devolver un chiste de Papá si el tipo es "Dad"', (done) => {
            chai.request(app)
                .get('/chistes?tipo=Dad')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('chiste');
                    done();
                });
        });

        it('debería devolver un error si se especifica un tipo no válido', (done) => {
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
        it('debería guardar un nuevo chiste y devolver un mensaje de éxito', (done) => {
            chai.request(app)
                .post('/chistes')
                .send({ texto: 'Este es un chiste de prueba' })
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

        it('debería devolver un error si falta el campo "texto"', (done) => {
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
        it('debería actualizar el texto de un chiste y devolver un mensaje de éxito', (done) => {
            chai.request(app)
                .put('/chistes/1')
                .send({ texto: 'Este es un chiste actualizado' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('mensaje');
                    expect(res.body).to.have.property('chiste');
                    done();
                });
        });

        it('debería devolver un error si no se encuentra el chiste con el número especificado', (done) => {
            chai.request(app)
                .put('/chistes/999')
                .send({ texto: 'Este es un chiste actualizado' })
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('error');
                    done();
                });
        });

        it('debería devolver un error si falta el campo "texto"', (done) => {
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
        it('debería eliminar un chiste y devolver un mensaje de éxito', (done) => {
            chai.request(app)
                .delete('/chistes/1')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('mensaje');
                    done();
                });
        });

        it('debería devolver un error si no se encuentra el chiste con el número especificado', (done) => {
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
        it('debería calcular el MCM de una lista de números', (done) => {
            chai.request(app)
                .get('/lcm?numbers=2&numbers=3&numbers=4')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('mcm');
                    done();
                });
        });

        it('debería devolver un error si se proporcionan menos de 2 números', (done) => {
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
        it('debería incrementar un número en 1', (done) => {
            chai.request(app)
                .get('/increment?number=5')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('numeroIncrementado');
                    expect(res.body.numeroIncrementado).to.equal(6);
                    done();
                });
        });

        it('debería devolver un error si falta el número', (done) => {
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
