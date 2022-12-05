const PeticaoModel = require('../models/peticaoModel');
// pode ser na mesma classe
const Joi = require('joi')

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
            const peticaoId = req.params.id;
            const peticao = await PeticaoModel.getPeticaoById(peticaoId);
            if (!peticao) 
                return res.status(404).json(`Não existe peticao cadastrada com o id ${peticaoId}.`);
            else
                return res.status(200).json(peticao);
        } catch (error) {
            console.log(`[Controller - get peticao by id error] ${error}`);
            return res.status(500).json(error);
        }
    }
    static async addPeticao(req, res) {
        console.log('[Add Peticao Controller]', req.body);

        //Verifica se os campos foram preenchidos corretamente
        const { error, value } = schema.validate(req.body);
        if (error) {
            const result = {
                msg: 'Peticao não incluída. Campos não foram preenchidos corretamente.',
                error: error.details
            }
            return res.status(404).json(result);
        }

        //Verifica se o email foi preenchido corretamente
        const usuario = req.headers['authorization'];
        const { errorEmail, valueEmail } = schemaEmail.validate(usuario);
        if (errorEmail) {
            const result = {
                msg: 'Peticao não incluída. Email não foi preenchido corretamente.',
                error: errorEmail.details
            }
            return res.status(404).json(result);
        }

        try {
            const addedPeticao = await PeticaoModel.addPeticao(req.body, usuario);
            return res.status(200).json(addedPeticao);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    static async updatePeticao(req, res) {
        console.log('[Update Peticao Controller]', req.body);

        //Verifica se petição existe
        const peticaoId = req.params.id;
        const peticao = await PeticaoModel.getPeticaoById(peticaoId);
        if (!peticao) return res.status(404).json(`Não existe peticao cadastrada com o id ${peticaoId}.`);

        //Verifica se quem quer atualizar é o criador da petição
        const usuario = req.headers['authorization'];
        if(peticao.usuario != usuario) {
            return res.status(401).json("Petição não atualizada, você não tem acesso.");
        }

        //Verifica se os campos foram preenchidos corretamente
        const { error, value } = schema.validate(req.body);
        if (error) {
            const result = {
                msg: 'Peticao não atualizada. Campos não foram preenchidos corretamente.',
                error: error.details
            }
            return res.status(404).json(result);
        }

        const updatedPeticao = await PeticaoModel.updatePeticao(peticaoId, req.body);
        return res.status(200).json(updatedPeticao);
    }

    static async deletePeticao(req, res) {
        try {
            //Verifica se petição existe
            const peticaoId = req.params.id;
            const peticao = await PeticaoModel.getPeticaoById(peticaoId);
            if (!peticao) return res.status(404).json(`Não existe peticao cadastrada com o id ${peticaoId}.`);

            //Verifica se quem quer atualizar é o criador da petição
            const usuario = req.headers['authorization'];
            if(peticao.usuario != usuario) {
                return res.status(401).json("Petição não deletada, você não tem acesso.");
            }

            const deletePeticao = await PeticaoModel.deletePeticao(req.params.id);
            return res.status(200).json(deletePeticao);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    static async signPeticao(req, res) {
        try {
            //Verifica se petição existe
            const peticaoId = req.params.id;
            const peticao = await PeticaoModel.getPeticaoById(peticaoId);
            if (!peticao) return res.status(404).json(`Não existe peticao cadastrada com o id ${peticaoId}.`);

            //Verifica se a petição já foi assinada
            const usuario = req.headers['authorization'];
            if(peticao.assinantes.includes(usuario)) {
                return res.status(401).json("Petição não atualizada, você já tinha assinado.");
            } else {
                const assinantes = peticao.assinantes;
                assinantes.push(usuario);
                const signPeticao = await PeticaoModel.signPeticao(req.params.id, assinantes);
                return res.status(200).json(signPeticao);
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    static async totalPeticao(req, res) {
        try {
            //Verifica se petição existe
            const peticaoId = req.params.id;
            const peticao = await PeticaoModel.getPeticaoById(peticaoId);
            if (!peticao) {
                return res.status(404).json(`Não existe peticao cadastrada com o id ${peticaoId}.`);
            }
            else {
                const totalPeticao = peticao.assinantes.length;
                return res.status(200).json(`Total de assinantes: ${totalPeticao} da petição: ${peticao.titulo}. Assinantes: ${peticao.assinantes}`);
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}