import chalk from 'chalk';
import express from 'express';
import BooksRouter, { routes as booksRoutes } from './modules/BooksModul/books.controller.js';
import CollectionRouter, { routes as collectionRoutes } from './modules/CollectionModule/collection.controller.js';
import LogsRouter, { routes as logsRoutes } from './modules/LogsModule/logs.controller.js';
import { DBConnection } from './DB/db.connection.js';
import { bookModel } from './DB/models/BookModel/book.model.js';
import { logModel } from './DB/models/logModel/log.model.js';
import { authorModel } from './DB/models/authorModel/author.model.js';

const app = express();

const bootsrtrap = async () => {
    await DBConnection();
    app.use(express.json());

    

    app.use(booksRoutes.base, BooksRouter);
    app.use(collectionRoutes.base, CollectionRouter);
    app.use(logsRoutes.base, LogsRouter);

    app.listen(3000, () => {
        console.log(chalk.green("server is running ..."));
    });
};

export default bootsrtrap;