import { /* inject, */ BindingScope, injectable } from '@loopback/core';
import { repository } from '@loopback/repository';
import { Keys } from '../llaves/config';
import { CambioClave, User } from '../models';
import { UserRepository } from '../repositories/user.repository';
var generator = require('generate-password');
var CryptoJS = require("crypto-js");

@injectable({ scope: BindingScope.TRANSIENT })
export class KeyManagerService {
  constructor(@repository(UserRepository)
  public usuarioRepository: UserRepository
  ) { }

  /*
   * Add service methods here
   */

  async CambiarCLave(credencialesClave: CambioClave): Promise<User | null> {
    let usuario = await this.usuarioRepository.findOne({
      where: {
        _id: credencialesClave.id_user,
        clave: credencialesClave.clave_actual
      }
    });
    if (usuario) {
      usuario.clave = credencialesClave.nueva_clave;
      await this.usuarioRepository.updateById(credencialesClave.id_user, usuario)
      return usuario;
    } else {
      return null;
    }
  }

  async RecuperarClave(email: string): Promise<User | null> {
    let usuario = await this.usuarioRepository.findOne({
      where: {
        email: email
      }
    });
    if (usuario) {
      let clave = this.CrearClaveAleatoria();
      usuario.clave = this.CifrarTexto(clave);
      await this.usuarioRepository.updateById(usuario._id, usuario)
      return usuario
    } else {
      return null;
    }
  }


  CrearClaveAleatoria(): string {
    let password = generator.generate({
      length: 8,
      number: true,
      uppercase: true
    })
    return password
  }

  CifrarTexto(texto: string) {
    let data = CryptoJS.AES.encrypt(texto, Keys.key_encript_decrypt);
    return data;
  }

  DescifrarTexto(texto: string | undefined) {
    let decrypted;
    return decrypted = CryptoJS.AES.decrypt(texto, Keys.key_encript_decrypt).toString(CryptoJS.enc.Utf8);
  }
}
