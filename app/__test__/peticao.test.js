const supertest = require('supertest');
const app = require('../../index');
//Testes GET, PUT, DELET, POST

describe('peticao', () => {

    //Get all
    describe('get all peticao route', () => {
        describe('get all peticao route', () => {
            it('should return a 200', async () => {
                await supertest(app).get("/api/peticao/").expect(200);
            });
        });
    });

    Login
    describe('Login route', () => {
        it('should return a 200', async () => {
            await supertest(app).get("/login").send(
                {
                    "email": "teste@gmail.com",
                    "senha": "123456"
                }
            ).expect(200);
        });
    });

    //post petição
    describe('Post peticao', () => {
        it('should return a 200', async () => {
            app.all('*', async req => {
                req.session.email = "teste@gmail.com";
                await supertest(app).post("/api/peticao/").send({
                    "titulo": "Ajuda as plantas POST",
                    "descricao": "Petição para coletar fundos para as plantas POST",
                    "foto": "https://a-static.mlcdn.com.br/1500x1500/6-plantas-de-seda-artificial-para-decoracao-aquarios-vasos-lagos-kares/megaaquarios/873046007/4039d34b0c5ba546740e914ef0009439.jpg"
                }).expect(200);
            });
        });
    });

    describe('post peticao route', () => {
        it('should return a 404', async () => {
            app.all('*', async req => {
                req.session.email = "teste@gmail.com";
                await supertest(app).post("/api/peticao/").send({
                    "titulo": "Ajuda as plantas",
                    "descricao": "",
                    "foto": ""
                }).expect(404);
            });
        });
    });

   // GET by id
    describe('get peticao by id', () => {
        it('should return a 200', async () => {
            await supertest(app).get("/api/peticao/63976e620e8fa76eb5fe7e40").expect(200);
        });
    });

    describe('given the peticoes does not exist', () => {
        it('should return a 404', async () => {
            await supertest(app).get("/api/peticao/638da9bb3b385ce223c33171").expect(404);
        })
    });

    //put petição
    describe('update one peticao', () => {
        it('should return a 200', async () => {
            app.all('*', async req => {
                req.session.email = "teste@gmail.com";
                await supertest(app).put("/api/peticao/63976e620e8fa76eb5fe7e40").send({
                    "titulo": "Ajuda as plantas PUT",
                    "descricao": "Petição para coletar fundos para as plantas PUT",
                    "foto": "https://a-static.mlcdn.com.br/1500x1500/6-plantas-de-seda-artificial-para-decoracao-aquarios-vasos-lagos-kares/megaaquarios/873046007/4039d34b0c5ba546740e914ef0009439.jpg"
                }).expect(200);
            });
        });
    });

    describe('put peticao route', () => {
        it('should return a 404', async () => {
            app.all('*', async req => {
                req.session.email = "teste@gmail.com";
                await supertest(app).put("/api/peticao/63976e620e8fa76eb5fe7e40").send({
                    "titulo": "Ajuda as plantas PUT",
                    "descricao": "Petição para coletar fundos para as plantas PUT",
                    "foto": ""
                }).expect(404);
            });
        });
    });

     //Assinar petição
    describe('Sign peticao route', () => {
        it('should return a 200', async () => {
            app.all('*', async req => {
                req.session.email = "teste@gmail.com";
                await supertest(app).post("/sign/peticao/63976e620e8fa76eb5fe7e40").expect(200);
            });
        });
    });

    describe('Sign peticao Again route', () => {
        it('should return a 401', async () => {
            app.all('*', async req => {
                req.session.email = "teste@gmail.com";
                await supertest(app).post("/sign/peticao/63976e620e8fa76eb5fe7e40").expect(401);
            });
        });
    });

    // Deletar petição
    describe('delete peticao route', () => {
        it('should return a 404', async () => {
            await supertest(app).delete("/api/peticao/639746ff4a4cec58b6c3d771").expect(404);
        });
    });
    
    describe('delete peticao route', () => {
        it('should return a 200', async () => {
            await supertest(app).delete("/api/peticao/63976e620e8fa76eb5fe7e40").expect(200);
        });
    });

    Logout
    describe('Logout route', () => {
        it('should return a 200', async () => {
            app.all('*', async req => {
                req.session.email = "teste@gmail.com";
                await supertest(app).get("/logout").expect(200);
            });
        });
    });
});