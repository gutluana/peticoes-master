const client = require('../config/dbConnection')
const { ObjectId } = require('mongodb')

module.exports = class PeticaoModel {
    static async getAllPeticao() {
        console.log(`[get peticao model]`);
        const cursor = client.db("peticao").collection("assinatura").find();
        const peticoes = await cursor.toArray();
        console.log(`[peticao controller: retorno do banco] ${peticoes}`)
        return peticoes;
    }

    static async getPeticaoById(peticaoId) {
        console.log(`[estou no PeticaoModel , getById] ${peticaoId}`);
        peticaoId = new ObjectId(peticaoId);
        const peticao = await client.db("peticao").collection("assinatura").findOne({
            _id: peticaoId
        });
        return peticao;
    }
    static async addPeticao(data, usuario) {
        console.log(`[Peticao Model - Add Peticao] ${data}`);
        try {
            const newPeticao = {
                titulo: data.titulo,
                descricao: data.descricao,
                usuario: usuario,
                assinantes: [],
                foto: data.foto,
                date: new Date()
            }
            const addedPeticao = await client.db("peticao").collection("assinatura").insertOne(newPeticao);
            console.log(`New Peticao inserted with the following id ${addedPeticao.insertedId}`);
            return addedPeticao;
        } catch (error) {
            console.log(`[PeticaoService] Error: ${error}`);
        }
    }
    static async updatePeticao(id, data) {
        console.log(`[Peticao Model - Update Peticao] ${id}`);
        try {
            const idPeticao = {
                _id: new ObjectId(id)
            };
            const dataPeticao = { 
                $set: 
                {
                    titulo: data.titulo,
                    descricao: data.descricao,
                    foto: data.foto
                }
            }
            const updatedPeticao = client.db("peticao").collection("assinatura").updateOne(idPeticao, dataPeticao);
            console.log(`Peticao atualizado ${updatedPeticao}`);
            return updatedPeticao;
        } catch (error) {
            console.log(`[peticaoService] Error: ${error}`);
        }
    }
    static async deletePeticao(peticaoId) {
        console.log(`[Peticao Model - delete Peticao] ${peticaoId}`);
        const query = {
            _id: new ObjectId(peticaoId)
        };
        try {
            return await client.db("peticao").collection("assinatura").deleteOne(query);
        } catch (error) {
            console.log(`[peticaoService] Error: ${error}`);
        }
    }
    static async signPeticao(id, data) {
        console.log(`[Peticao Model - Sign Peticao] ${id}`);
        try {
            const idPeticao = {
                _id: new ObjectId(id)
            };
            const dataPeticao = { 
                $set: 
                {
                    assinantes: data,
                }
            }
            const updatedPeticao = client.db("peticao").collection("assinatura").updateOne(idPeticao, dataPeticao);
            console.log(`Peticao assinada ${updatedPeticao}`);
            return updatedPeticao;
        } catch (error) {
            console.log(`[peticaoService] Error: ${error}`);
        }
    }
}