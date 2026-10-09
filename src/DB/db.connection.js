import chalk from "chalk";
import {MongoClient} from "mongodb";

const client = new MongoClient("mongodb://localhost:27017",{
    serverSelectionTimeoutMS: 5000
});

export const DB = client.db("MondoDB_Assignment");

export const DBConnection = async () =>{
    try {
        await client.connect();
        console.log(chalk.green("Connected to mongoDb"));
        
    } catch (error) {
        console.log(chalk.red("err in connection =>",error));
        
    }
}
