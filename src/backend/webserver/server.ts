import express, { Request, Response } from 'express';
import { createPool, PoolConnection } from 'mariadb';
import bodyParser from 'body-parser';
import { createServer } from 'node:http';
import * as dotenv from 'dotenv';
import { handleSupplyOverviewHomeRequest } from './dataRequestHandler/GrocerySupplyOverviewHomeHandler';
import { handleExpirationDateRequest } from './dataRequestHandler/ExpirationDateRequestHandler';
import { handleCategoryDataRequest } from './dataRequestHandler/CategoryRequestHandler';
import { handleMeasurementUnitRequest } from './dataRequestHandler/MeasurementUnitRequestHandler';


dotenv.config();

const app = express();
const server = createServer(app);


const dbConnectionPool = createPool(
   {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: 'grocery_item_manager',
      connectionLimit: 4
   }
);


type HandleRequestParam = {
   request: Request,
   response: Response,
   handler: (
      request: Request,
      dbConnection: PoolConnection,
      argumentList: string[]
   ) => Promise<any>,
   argumentList: string[]
};


async function handleRequest(param: HandleRequestParam): Promise<void> {
   const { request, response, handler, argumentList } = param;

   let dbConnection: PoolConnection | undefined;
   try {
      dbConnection = await dbConnectionPool.getConnection();
      const result = await handler(request, dbConnection, argumentList);
      response.json(result);
      await dbConnection.release();
   } catch (error) {
      await dbConnection?.release();
   }
}


app.use('/', express.static('../dist/public'));


app.use(bodyParser.urlencoded({ extended: true }));


app.get('/api/Home/supplyOverview', async (request, response) => {
   const param = {
      request,
      response,
      handler: handleSupplyOverviewHomeRequest,
      argumentList: [] as string[]
   };
   await handleRequest(param);
});


app.get('/api/Home/expirationDateOverview/:dayLimit', async (request, response) => {
   const param = {
      request,
      response,
      handler: handleExpirationDateRequest,
      argumentList: [request.params.dayLimit]
   };
   await handleRequest(param);
});


app.get('/api/GroceryItemAdd/categoryData', async (request, response) => {
   const param = {
      request,
      response,
      handler: handleCategoryDataRequest,
      argumentList: [] as string[]
   };
   await handleRequest(param);
});


app.get('/api/GroceryItemAdd/measurementUnitData', async (request, response) => {
   const param = {
      request,
      response,
      handler: handleMeasurementUnitRequest,
      argumentList: [] as string[]
   };
   await handleRequest(param);
});


app.post('/api/GroceryItemAdd/addCategoryData', async (request, response) => {
   console.log('Post request received');
   console.log(request.body);
});


server.listen(8080);
