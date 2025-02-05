
const DatabaseConfig = () => ({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        __dirname + '/../src/**/*entity{.ts,.js}'
    ],
    synchronize: true
});

export default DatabaseConfig;