import axios from "axios";
import * as dotenv from "dotenv";
import {APIGatewayEvent} from "aws-lambda";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";
import {fromEnv} from "@aws-sdk/credential-providers";

dotenv.config();

const dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
});
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

const CACHE_TABLE = "StarWarsCache";
const CACHE_TIME = 30 * 60 * 1000;

export const getFusion = async (event: APIGatewayEvent) => {
    try {
        const characterId = event.pathParameters?.id;
        if (!characterId) {
            return {
                statusCode: 400,
                body: JSON.stringify({error: "Character ID is required"}),
            };
        }

        const cacheKey = `fusion-${characterId}`;
        const params = {TableName: CACHE_TABLE, Key: {id: cacheKey}};

        const cacheData = await dynamoDB.send(new GetCommand(params));
        if (cacheData.Item && cacheData.Item.data && cacheData.Item.timestamp > Date.now() - CACHE_TIME) {
            return {statusCode: 200, body: JSON.stringify(cacheData.Item.data)};
        }

        const starWarsCharacter = await axios.get(`${process.env.SWAPI_URL}/people/${characterId}`);
        const homeworldUrl = starWarsCharacter.data.homeworld;
        const planetData = await axios.get(homeworldUrl);

        const starWarsData = {
            name: starWarsCharacter.data.name,
            homeworld: planetData.data.name,
            climate: planetData.data.climate,
            terrain: planetData.data.terrain,
        };

        const rickAndMortyPlanets = await axios.get(`${process.env.RICKANDMORTY_URL}/location`);
        const planetsList = rickAndMortyPlanets.data.results;

        let matchedPlanet = planetsList.find(p =>
            p.name.toLowerCase().includes(starWarsData.homeworld.toLowerCase()) ||
            p.type.toLowerCase().includes(starWarsData.terrain.toLowerCase())
        );

        if (!matchedPlanet) {
            matchedPlanet = planetsList[Math.floor(Math.random() * planetsList.length)];
        }

        const rickAndMortyData = {
            name: matchedPlanet.name,
            type: matchedPlanet.type,
            dimension: matchedPlanet.dimension,
        };

        const mergedData = {
            starWars: starWarsData,
            relatedRickAndMortyLocation: rickAndMortyData,
        };

        console.log("Merged Data:", mergedData);

        await dynamoDB.send(new PutCommand({
            TableName: CACHE_TABLE,
            Item: {id: cacheKey, data: mergedData, timestamp: Date.now()},
        }));

        return {statusCode: 200, body: JSON.stringify(mergedData)};
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Failed to fetch data", details: error.message}),
        };
    }
};
