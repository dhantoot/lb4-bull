import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class HealthCheck extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID?: number;

  @property({
    type: 'date',
    required: true,
  })
  timestamp: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<HealthCheck>) {
    super(data);
  }
}

export interface HealthCheckRelations {
  // describe navigational properties here
}

export type HealthCheckWithRelations = HealthCheck & HealthCheckRelations;
