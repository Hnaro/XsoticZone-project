import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
export const app = express();

export default runApp => {
    return app.listen(process.env.PORT, () => {
        console.log("app is listening to port: "+process.env.PORT);
    });
}