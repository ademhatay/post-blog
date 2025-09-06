export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpire: process.env.JWT_ACCESS_EXPIRE,
        refreshExpire: process.env.JWT_REFRESH_EXPIRE ,
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },
});
