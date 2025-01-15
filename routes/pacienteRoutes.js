import express from 'express';
const router = express.Router();
import checkAuth from  '../middleware/authMiddleware.js';

import { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } from '../controllers/pacienteController.js';

router.route('/')
    .post(checkAuth, agregarPaciente)//(C)
    .get(checkAuth, obtenerPacientes);//(R)

router
    .route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)//(U)
    .delete(checkAuth, eliminarPaciente)//(D)

export default router;