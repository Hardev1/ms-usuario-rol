import { service } from '@loopback/core';
import { getModelSchemaRef, post, requestBody, response } from '@loopback/rest';
import { TokenValidator } from '../models';
import { SesionUsuariosService } from '../services';


export class SessionValidatorController {
  constructor(
    @service(SesionUsuariosService)
    private sessionService: SesionUsuariosService
  ) { }

  @post('/token-validator')
  @response(200, {
    description: 'Validación de token',
    content: { 'application/json': { schema: getModelSchemaRef(TokenValidator) } },
  })

  async tokenValidator(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TokenValidator, {
            title: 'Validar Token'
          }),
        },
      },
    })
    tokenValidator: TokenValidator): Promise<boolean> {
    return this.sessionService.ValidarToken(tokenValidator.token);
  }

}