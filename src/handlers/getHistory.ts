import {DynamoDBDocumentClient, ScanCommand} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {fromEnv} from "@aws-sdk/credential-providers";
import * as dotenv from "dotenv";

dotenv.config();

const dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
});
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

const DATA_TABLE = "StarWarsCustomData";

export const getHistory = async () => {
    try {
        const params = {
            TableName: DATA_TABLE,
        };

        const data = await dynamoDB.send(new ScanCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Failed to retrieve history", details: error.message}),
        };
    }
};
