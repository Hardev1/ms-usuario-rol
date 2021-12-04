import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import { Keys } from '../llaves/config';
import { UserRol } from '../models';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class AsignarRolService {
  constructor(/* Add @inject to inject parameters */) {}

  async CrearUsuarioEv(datos: UserRol) {
    const body = {
      id_user: datos.id_user,
      id_rol: datos.id_rol,
    };
    const response = await fetch(`${Keys.asignar_rol_ev}`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'},
    });
  }
}