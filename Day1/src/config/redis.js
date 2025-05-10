
const {createClient} = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-10279.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 10279
    }
});
module.exports = redisClient;