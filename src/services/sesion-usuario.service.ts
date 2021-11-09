import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Keys} from '../llaves/config';
import {Credentials, User} from '../models';
import {UserRepository} from '../repositories';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class SesionUsuariosService {
  constructor(@repository(UserRepository)
  public usuarioRepository: UserRepository
  ) { }

  async IdentificarUsuario(credenciales: Credentials) {
    let usuario = await this.usuarioRepository.findOne({
      where: {
        email: credenciales.usuario,
        clave: credenciales.clave
      }
    });
    return usuario
  }


  async GenerarToken(datos: User, rol: string): Promise<string> {
    let url = `${Keys.urlToken}?${Keys.arg_nombre}=${datos.nombre}&${Keys.arg_id_persona}=${datos._id}&${Keys.arg_id_rol}=${rol}`;
    let token = "";
    await fetch(url)
      .then(async (res: any) => {
        token = await res.text()
      })
    return token;
  }

}