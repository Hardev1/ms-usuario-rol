import {Model, model, property} from '@loopback/repository';

@model()
export class TokenValidator extends Model {
  @property({
    type: 'string',
    required: true,
  })
  token: string;

  constructor(data?: Partial<TokenValidator>) {
    super(data);
  }
}

export interface TokenValidatorRelations {
  // describe navigational properties here
}

export type TokenValidatorWithRelations = TokenValidator & TokenValidatorRelations;
