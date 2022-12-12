const PeticaoModel = require('../models/peticaoModel');
let crypto = require('crypto');
// pode ser na mesma classe
const Joi = require('joi');

const schema = Joi.object().keys({
    titulo: Joi.string().required().min(1).max(50),
    descricao: Joi.string().required().min(1).max(250),
    foto: Joi.string().required().min(1).max(750)
});

const schemaEmail = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

module.exports = class PeticoesController {
    static async apiGetAllPeticoes(req, res) {
        console.log('Controller Peticoes - get peticoes');
        try {
            const peticoes = await PeticaoModel.getAllPeticao();
            if (!peticoes) 
                return res.status(404).json(`Não existe nenhuma petição cadastrada.`);
            else
                return res.status(200).json(peticoes);
        } catch (error) {
            console.log(`[controller getallpeticoes error] ${error}`);
            return res.status(500).json(error);
        }
    }
    static async getPeticaoById(req, res) {
        console.log(`Controller peticoes - get peticao by id ${req.params.id}`);
        try {
            const id = req.params.id;
            const peticao = await PeticaoModel.getPeticaoById(id);
            if (!peticao) 
                return res.status(404).json(`Não existe peticao cadastrada com o id ${id}.`);
            else
                return res.status(200).json(peticao);
        } catch (error) {
            console.log(`[Controller - get peticao by id error] ${error}`);
            return res.status(500).json(error);
        }
    }
    static async addPeticao(req, res) {
        const data = req.body;
        console.log('[Add Peticao Controller]', data);
        try {
            //Verifica se quem quer criar está autenticado
            const usuario = req.session.email;
            if(usuario == "" || usuario == null) return res.status(401).json("Petição não foi criada, você não tem acesso.");
            
            //Verifica se os campos foram preenchidos corretamente
            const { error } = schema.validate(data);
            if (error) {
                return res.status(404).json({
                    msg: 'Peticao não incluída. Campos não foram preenchidos corretamente.',
                    error: error.details
                });
            }

            const addedPeticao = await PeticaoModel.addPeticao(data, usuario);
            return res.status(200).json(addedPeticao);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    static async updatePeticao(req, res) {
        const data = req.body;
        console.log('[Update Peticao Controller]', data);
        
        //Verifica se petição existe
        const id = req.params.id;
        const peticao = await PeticaoModel.getPeticaoById(id);
        if (!peticao) return res.status(404).json(`Não existe peticao cadastrada com o id ${id}.`);
        
        //Verifica se quem quer atualizar é o criador da petição
        const usuario = req.session.email;
        if (peticao.usuario != usuario) return res.status(401).json("Petição não atualizada, você não tem acesso.");

        //Verifica se os campos foram preenchidos corretamente
        const { error } = schema.validate(data);
        if (error) {
            const result = {
                msg: 'Peticao não atualizada. Campos não foram preenchidos corretamente.',
                error: error.details
            }
            return res.status(404).json(result);
        }

        const updatedPeticao = await PeticaoModel.updatePeticao(id, data);
        return res.status(200).json(updatedPeticao);
    }

    static async deletePeticao(req, res) {
        try {
            //Verifica se petição existe
            const id = req.params.id;
            const peticao = await PeticaoModel.getPeticaoById(id);
            if (!peticao) return res.status(404).json(`Não existe peticao cadastrada com o id ${id}.`);

            //Verifica se quem quer deletar é o criador da petição
            const usuario = req.session.email;
            if (peticao.usuario != usuario) return res.status(401).json("Petição não deletada, você não tem acesso.");

            const deletePeticao = await PeticaoModel.deletePeticao(req.params.id);
            return res.status(200).json(deletePeticao);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    static async signPeticao(req, res) {
        try {
            //Verifica se a petição existe
            const id = req.params.id;
            const peticao = await PeticaoModel.getPeticaoById(id);
            if (!peticao) return res.status(404).json(`Não existe peticao cadastrada com o id ${id}.`);

            //Verifica se quem quer assinar está autenticado
            const usuario = req.session.email;
            if(usuario == "" && usuario != null) return res.status(401).json("Petição não foi assinada, você não tem acesso.");

            //Verifica se a petição já foi assinada
            if (peticao.assinantes.includes(usuario)) return res.status(401).json("Você já tinha assinado essa petição.");

            const assinantes = peticao.assinantes;
            assinantes.push(usuario);
            const signPeticao = await PeticaoModel.signPeticao(req.params.id, assinantes);
            return res.status(200).json(signPeticao);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    static async totalPeticao(req, res) {
        try {
            //Verifica se a petição existe
            const id = req.params.id;
            const peticao = await PeticaoModel.getPeticaoById(id);
            if (!peticao) {
                return res.status(404).json(`Não existe peticao cadastrada com o id ${id}.`);
            }
            else {
                const totalPeticao = peticao.assinantes.length;
                return res.status(200).json(`Total de assinantes: ${totalPeticao} da petição: ${peticao.titulo}. Assinantes: ${peticao.assinantes}`);
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    //Autenticar
    static async login(req, res) {
        const data = req.body;
        const senha = crypto.createHash("md5").update(data.senha).digest("hex");
        try {
            //Verifica se o usuário existe
            const usuario = await PeticaoModel.getUser(data.email);
            if (!usuario) {
                return res.status(404).json(`Não existe usuário cadastrado com o email ${data.email}.`);
            } else if (usuario.senha != senha) {
                return res.status(401).json(`Senha incorreta`);
            }
            else {
                req.session.email = usuario.email;
                console.log("LOGIN: ", req.session.email);
                console.log("SESSION: ", req.session);
                return res.status(200).json(`${req.session.email} entrou no sistema!`);
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    //Autenticar
    static async logout(req, res) {
        const usuario = req.session.email;
        console.log("LOGOUT: ", req.session.email);
        console.log("SESSION: ", req.session);
        if(usuario != null && usuario != "") {
            req.session.email = "";
            return res.status(200).json(`${usuario} saiu do sistema!`);
        } else {
            return res.status(400).json(`Você ainda não tinha entrado no sistema!`);
        }
    }

    //Criar usuário
    static async createLogin(req, res) {
        const data = req.body;
        try {
            //Verifica se o email foi preenchido corretamente
            const { errorEmail } = schemaEmail.validate(data.email);
            if (errorEmail) {
                return res.status(400).json({
                    msg: 'Email não foi preenchido corretamente.',
                    error: errorEmail.details
                });
            } 
            const usuario = await PeticaoModel.getUser(data.email);
            if (!usuario) {
                const novoUsuario = await PeticaoModel.postUser(data);
                return res.status(200).json(`Usuário criado : ${novoUsuario}`);
            }
            else {
                return res.status(401).json(`Email ${data.email} já está cadastrado`);
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}