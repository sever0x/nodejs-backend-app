const config = {
    consul: {
        server: {
            prod: {
                host: 'consul',
                port: '8500',
            },
            dev: {
                host: 'localhost',
                port: '8501',
            },
        },
        service: {
            name: 'nodejs-backend-app',
        },
    },
    log4js: {
        appenders: {
            console: {
                type: 'console',
            },
            ms: {
                type: 'dateFile',
                pattern: '-yyyy-MM-dd.log',
                alwaysIncludePattern: true,
                filename: 'log/ms',
                maxLogSize: 1000000,
                compress: true,
            },
        },
        categories: {
            default: {
                appenders: ['ms', 'console'],
                level: 'debug',
            },
        },
    },
    backendExternal: {
        url: 'http://localhost:8080',
        mapping: {
            song: '/api/song',
        }
    },
    kafka: {
        clientId: 'nodejs-backend-app',
        brokers: ['localhost:9092'],
        topic: 'email-service'
    },
};

export default config;
