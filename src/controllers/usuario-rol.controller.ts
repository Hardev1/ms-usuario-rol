import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
Usuario,
UsuarioRol,
Rol,
} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioRolController {
  constructor(
    @repository(UsuarioRepository) protected usuarioRepository: UsuarioRepository,
  ) { }

  @get('/usuarios/{id}/rols', {
    responses: {
      '200': {
        description: 'Array of Usuario has many Rol through UsuarioRol',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Rol)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Rol>,
  ): Promise<Rol[]> {
    return this.usuarioRepository.tiene_muchos(id).find(filter);
  }

  @post('/usuarios/{id}/rols', {
    responses: {
      '200': {
        description: 'create a Rol model instance',
        content: {'application/json': {schema: getModelSchemaRef(Rol)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Usuario.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, {
            title: 'NewRolInUsuario',
            exclude: ['_id'],
          }),
        },
      },
    }) rol: Omit<Rol, '_id'>,
  ): Promise<Rol> {
    return this.usuarioRepository.tiene_muchos(id).create(rol);
  }

  @patch('/usuarios/{id}/rols', {
    responses: {
      '200': {
        description: 'Usuario.Rol PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rol, {partial: true}),
        },
      },
    })
    rol: Partial<Rol>,
    @param.query.object('where', getWhereSchemaFor(Rol)) where?: Where<Rol>,
  ): Promise<Count> {
    return this.usuarioRepository.tiene_muchos(id).patch(rol, where);
  }

  @del('/usuarios/{id}/rols', {
    responses: {
      '200': {
        description: 'Usuario.Rol DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Rol)) where?: Where<Rol>,
  ): Promise<Count> {
    return this.usuarioRepository.tiene_muchos(id).delete(where);
  }
}
