import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class UsuarioRol extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
  })
  id_usuario?: string;

  @property({
    type: 'string',
  })
  id_rol?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UsuarioRol>) {
    super(data);
  }
}

export interface UsuarioRolRelations {
  // describe navigational properties here
}

export type UsuarioRolWithRelations = UsuarioRol & UsuarioRolRelations;
