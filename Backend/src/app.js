import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(cookieParser());
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static('public'));


import {userRouter} from './routes/user.route.js';
import {postRouter} from './routes/post.route.js';
import {workspaceRouter} from './routes/workspace.route.js';
import {taskRouter} from './routes/task.route.js';


app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/workspace", workspaceRouter);
app.use("/api/v1/task", taskRouter);


export {app};