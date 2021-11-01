import { injectable, BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Credentials, User } from '../models';
import { UserRepository } from '../repositories';
import {Keys} from '../llaves/config';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class UserSessionService {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async  identificarUsuario(credenciales: Credentials) {
    let user = await this.userRepository.findOne({
      where: {
        email: credenciales.usuario,
        clave: credenciales.clave,
      },
    });
    return user
  }

  async GenerarToken(datos: User): Promise<string> {
    let url = `${Keys.url_crear_token}?${Keys.arg_nombre}=${datos.nombre}&${Keys.arg_id_persona}=${datos._id}&${Keys.arg_rol}=${datos.rols}`;
    let token = "";
    await fetch(url)
      .then(async (res: any) => {
        token = await res.text()
      })
    return token;
  }

}
