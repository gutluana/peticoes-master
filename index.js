const app = require("./config/server");
const routes = require('./app/routes/routes')

// rota index controller e models 

routes.getAllPeticoes(app)
routes.addPeticao(app)
routes.getPeticaoById(app)
routes.updatePeticao(app)
routes.deletePeticao(app)
routes.signPeticao(app)
routes.totalPeticao(app)
routes.login(app)
routes.logout(app)
routes.createLogin(app)

module.exports = app;