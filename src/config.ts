import dotenv from 'dotenv';

dotenv.config();

const Config = {
    //Server Config
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    URL: process.env.URL || 'http://localhost',

};

export default Config;