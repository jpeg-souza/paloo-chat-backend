import express from 'express';
const router = express.Router()

// criando rota get para iniciar o servidor
router.get('/', (req, res) => {
    res.send('server online.') // apenas pra sinalizar
})

module.exports = router