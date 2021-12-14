import { /* inject, */ BindingScope, injectable, service } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Keys } from '../llaves/config';
import { Credentials, User } from '../models';
import { UserRepository } from '../repositories';
import { KeyManagerService } from './key-manager.service';
const fetch = require('node-fetch');
let CryptoJS = require('crypto-js');

@injectable({ scope: BindingScope.TRANSIENT })
export class SesionUsuariosService {
  constructor(@repository(UserRepository)
  public usuarioRepository: UserRepository,
    @service(KeyManagerService)
    public servicioClaves: KeyManagerService,
  ) { }

  async IdentificarUsuario(credenciales: Credentials) {
    let claveDescifrada = this.servicioClaves.DescifrarTexto(credenciales.clave);
    credenciales.clave = claveDescifrada;
    let usuario = await this.usuarioRepository.findOne({
      where: {
        email: credenciales.usuario
      }
    });
    let claveUsuario = this.servicioClaves.DescifrarTexto(usuario?.clave)
    if (claveUsuario === claveDescifrada) {
      return usuario
    }
    return null
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

  async ValidarToken(tk: string): Promise<boolean> {
    let url = `${Keys.url_validar_token}?${Keys.arg_token}=${tk}`;
    let resp = "";
    await fetch(url)
      .then(async (res: any) => {
        resp = await res.text()
      })
    return resp == "OK";
  }

}