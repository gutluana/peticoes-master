const supertest = require('supertest');
const app = require('../../index');

// Testes GET, PUT, DELET, POST

describe('peticao', () => {

    // Get all
    describe('get all peticao route', () => {
        describe('get all peticao route', () => {
            it('should return a 200', async () => {
                await supertest(app).get("/api/peticao/").expect(200);
            });
        });
    });

    // post petição
    describe('post peticao route', () => {
        describe('Post peticao', () => {
            it('should return a 200', async () => {
                await supertest(app).post("/api/peticao/").set('Authorization', 'luana@gmail.com').send({
                    "titulo": "Ajuda as plantas",
                    "descricao": "Petição para coletar fundos para as plantas",
                    "foto": "https://a-static.mlcdn.com.br/1500x1500/6-plantas-de-seda-artificial-para-decoracao-aquarios-vasos-lagos-kares/megaaquarios/873046007/4039d34b0c5ba546740e914ef0009439.jpg"
                }).expect(200);
            });
        });
    });

    describe('post peticao route', () => {
        it('should return a 404', async () => {
            await supertest(app).post("/api/peticao/").set('Authorization', 'luana@gmail.com').send({
                "titulo": "Ajuda as plantas",
                "descricao": "",
                "foto": ""
            }).expect(404);
        });
    });

    // GET by id
    describe('get peticao route', () => {
        describe('get peticao by id', () => {
            it('should return a 200', async () => {
                await supertest(app).get("/api/peticao/638dab042fc88ae77b3b5c01").expect(200);
            });
        });
    });

    describe('given the peticoes does not exist', () => {
        it('should return a 404', async () => {
            await supertest(app).get("/api/peticao/638da9bb3b385ce223c33171").expect(404);
        })
    });

    // put petição
    describe('put peticao route', () => {
        describe('update one peticao', () => {
            it('should return a 200', async () => {
                await supertest(app).put("/api/peticao/638dab042fc88ae77b3b5c01").set('Authorization', 'luana@gmail.com').send({
                    "titulo": "Ajuda as plantas PUT",
                    "descricao": "Petição para coletar fundos para as plantas PUT",
                    "foto": "https://a-static.mlcdn.com.br/1500x1500/6-plantas-de-seda-artificial-para-decoracao-aquarios-vasos-lagos-kares/megaaquarios/873046007/4039d34b0c5ba546740e914ef0009439.jpg"
                }).expect(200);
            });
        });
    });

    describe('put peticao route', () => {
        it('should return a 401', async () => {
            await supertest(app).put("/api/peticao/638dab042fc88ae77b3b5c01").set('Authorization', 'lua@gmail.com').send({
                "titulo": "Ajuda as plantas PUT",
                "descricao": "Petição para coletar fundos para as plantas PUT",
                "foto": "https://a-static.mlcdn.com.br/1500x1500/6-plantas-de-seda-artificial-para-decoracao-aquarios-vasos-lagos-kares/megaaquarios/873046007/4039d34b0c5ba546740e914ef0009439.jpg"
            }).expect(401);
        });
    });

     // Assinar petição
     describe('Sign peticao route', () => {
        it('should return a 200', async () => {
            await supertest(app).post("/sign/peticao/638dab042fc88ae77b3b5c01").set('Authorization', 'luana@gmail.com').expect(200);
        });
    });

    describe('Sign peticao route', () => {
        it('should return a 401', async () => {
            await supertest(app).post("/sign/peticao/638dab042fc88ae77b3b5c01").set('Authorization', 'luana@gmail.com').expect(401);
        });
    });

    // Deletar petição
    describe('delete peticao route', () => {
        it('should return a 401', async () => {
            await supertest(app).delete("/api/peticao/638dab042fc88ae77b3b5c01").set('Authorization', 'lua@gmail.com').expect(401);
        });
    });
    
    describe('delete peticao route', () => {
        it('should return a 200', async () => {
            await supertest(app).delete("/api/peticao/638dab042fc88ae77b3b5c01").set('Authorization', 'luana@gmail.com').expect(200);
        });
    });
});