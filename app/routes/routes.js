const PeticaoController = require("../controllers/peticaoController");

module.exports = {
    getAllPeticoes: (app) => {
        app.get('/api/peticao', (req, res) => {
            console.log(`estou no: [routes] get peticao`);
            PeticaoController.apiGetAllPeticoes(req, res);
        })
    },
    addPeticao: (app) => {
        app.post('/api/peticao', (req, res) => {
            console.log(`estou no: [routes] add peticao`);
            PeticaoController.addPeticao(req, res);
        })
    },
    getPeticaoById: (app) => {
        app.get('/api/peticao/:id', (req, res) => {
            console.log(`estou no: [routes] get peticao by id`);
            PeticaoController.getPeticaoById(req, res);
        });  
    },
    updatePeticao: (app) => {
        app.put('/api/peticao/:id', (req, res) => {
            console.log(`estou no: [routes] update peticao`);
            PeticaoController.updatePeticao(req, res);
        });
    },
    deletePeticao: (app) => {
       app.delete('/api/peticao/:id', (req, res) => {
            console.log(`estou no: [routes] delete peticao`);
            PeticaoController.deletePeticao(req, res);
        });
    },
    signPeticao: (app) => {
        app.post('/sign/peticao/:id', (req, res) => {
            console.log(`estou no: [routes] sign peticao`);
            PeticaoController.signPeticao(req, res);
        });
    },
    totalPeticao: (app) => {
        app.get('/total/peticao/:id', (req, res) => {
            console.log(`estou no: [routes] total peticao`);
            PeticaoController.totalPeticao(req, res);
        });
    }
}