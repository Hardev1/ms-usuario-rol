import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Keys} from '../llaves/config';
import {Notificacion, NotificacionSms} from '../models';
const fetch = require('node-fetch');

@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionesService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */

  EnviarCorreo(datos: Notificacion) {
    let url = `${Keys.urlCorreo}?${Keys.hashArg}=${Keys.hashNotificacion}&${Keys.destinoArg}=${datos.destinatario}&${Keys.asuntoArg}=${datos.asunto}&${Keys.mensajeArg}=${datos.mensaje}`;
    fetch(url)
      .then((res: any) => {
        console.log(res.text());

      })
  }


  EnviarSms(datos: NotificacionSms) {
    let url = `${Keys.urlSms}?${Keys.hashArg}=${Keys.hashNotificacion}&${Keys.destinoArg}=${datos.destinatario}&${Keys.mensajeArg}=${datos.mensaje}`
    fetch(url)
      .then((res: any) => {
        console.log(res.text());

      })
  }


}
