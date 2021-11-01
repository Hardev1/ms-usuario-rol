import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Keys} from '../llaves/config';
import {
  CambioClave,
  CredencialesRecuperarClave,
  Credentials,
  Notificacion,
  NotificacionSms,
  User,
} from '../models';
import {UserRepository} from '../repositories/user.repository';
import {KeyManagerService, NotificacionesService, UserSessionService} from '../services';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(KeyManagerService)
    public servicioClaves: KeyManagerService,
    @service(NotificacionesService)
    public servicioNotificaciones: NotificacionesService,
    @service(UserSessionService)
    private userSessionService: UserSessionService
  ) {}

  @post('/crear-usuario')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['_id'],
          }),
        },
      },
    })
    user: Omit<User, '_id'>,
  ): Promise<User | null> {
    let clave = this.servicioClaves.CrearClaveAleatoria();
    console.log(clave);
    let claveCifrada = this.servicioClaves.CifrarTexto(clave);
    user.clave = claveCifrada;
    let usuarioRepetido = await this.userRepository.findOne({
      where: {
        email: user.email,
        documento: user.documento,
      },
    });
    if (!usuarioRepetido) {
      let usuarioCreado = await this.userRepository.create(user);
      if (usuarioCreado) {
        let datos = new Notificacion();
        datos.destinatario = user.email;//el destinatario es el rol al que se le tiene que avisar
        datos.asunto = Keys.asuntoUsuarioCreado;
        datos.mensaje = `${Keys.saludo} ${user.nombre} <br>${Keys.mensajeUsuarioCreado} <br> ${clave}`;
        this.servicioNotificaciones.EnviarCorreo(datos);
        return usuarioCreado;
      }
    }
    return usuarioRepetido;
    
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  /**
   * ---------- Métodos Adicionales ------------
   */
  @post('/identificar-usuario')
  @response(200, {
    description: 'Identificación de usuarios',
    content: {'application/json': {schema: getModelSchemaRef(Credentials)}},
  })
  async identificarUsuario(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Credentials, {
            title: 'Identificar Usuario',
          }),
        },
      },
    })
    credentials: Credentials,
  ): Promise<object | null> {
    let usuario = await this.userSessionService.identificarUsuario(credentials);
    let tk = "";
    if (usuario) {
      usuario.clave = "";
      tk = await this.userSessionService.GenerarToken(usuario);
    }
    return {
      token: tk,
      usuario: usuario
    };
  }

  @post('/cambiar-clave', {
    responses: {
      '200': {
        description: 'Cambio de clave de usuarios',
      },
    },
  })
  async cambiarClave(@requestBody() datos: CambioClave): Promise<Boolean> {
    let usuario = await this.userRepository.findById(datos.id_user);

    if (usuario) {
      if (usuario.clave == datos.clave_actual) {
        usuario.clave = datos.nueva_clave;
        console.log(datos.nueva_clave);
        await this.userRepository.updateById(datos.id_user, usuario);
        let notificacionSms = new NotificacionSms();
        notificacionSms.destinatario = usuario.telefono;
        notificacionSms.mensaje = `${Keys.saludo} ${usuario.nombre} ${Keys.mensajeCambioClave}`;
        this.servicioNotificaciones.EnviarSms(notificacionSms);
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  @post('/recuperar-clave', {
    responses: {
      '200': {
        description: 'Recuperación de clave de usuarios',
      },
    },
  })
  async recuperarClave(
    @requestBody() credencialRecuperar: CredencialesRecuperarClave,
  ): Promise<Boolean> {
    let usuario = await this.userRepository.findOne({
      where: {
        email: credencialRecuperar.email,
      },
    });
    if (usuario) {
      let clave = this.servicioClaves.CrearClaveAleatoria();
      console.log(clave);
      let claveCifrada = this.servicioClaves.CifrarTexto(clave);
      console.log(claveCifrada);
      usuario.clave = claveCifrada;
      await this.userRepository.updateById(usuario._id, usuario);
      let notificacionSms = new NotificacionSms();
      notificacionSms.destinatario = usuario.telefono;
      notificacionSms.mensaje = `${Keys.saludo} ${usuario.nombre}, ${Keys.mensajeRecuperarClave} ${clave}`;
      this.servicioNotificaciones.EnviarSms(notificacionSms);
      return true;
    }
    return false;
  }
}
