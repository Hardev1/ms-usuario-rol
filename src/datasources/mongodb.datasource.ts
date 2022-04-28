import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

//url: 'mongodb+srv://admin-usuarios-rol:z5s5al6GdV0qywLJ@cluster0.3kvbr.mongodb.net/usuario_db?retryWrites=true&w=majority',

const config = {
  name: 'mongodb',
  connector: 'mongodb',
  url: 'mongodb://admin-usuarios-rol:z5s5al6GdV0qywLJ@cluster0-shard-00-00.3kvbr.mongodb.net:27017,cluster0-shard-00-01.3kvbr.mongodb.net:27017,cluster0-shard-00-02.3kvbr.mongodb.net:27017/usuario_db?ssl=true&replicaSet=atlas-fhr1n0-shard-0&authSource=admin&retryWrites=true&w=majority',
  host: 'localhost',
  port: 27017,
  user: 'admin-usuarios-rol',
  password: 'z5s5al6GdV0qywLJ',
  database: 'usuario_db',
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongodbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongodb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongodb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
