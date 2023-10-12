// here is entry point for XsoticZoneBackend
import runApp from './server.mjs';
import { router as indexRouter } from './router/index.mjs';
import * as express from 'express';
import { router as tictactoeRoutes } from './router/tictactoeRoutes.mjs';
import { app } from './server.mjs';
import { default as cors } from 'cors';
import { dbclient, rundb } from './mongoDBclient.mjs';

runApp();
rundb();
export const db = dbclient.db("tictactoeDB");
app.use(express.json());
app.use(cors());
app.use('/', indexRouter);
app.use('/t', tictactoeRoutes); 