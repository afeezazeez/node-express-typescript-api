import { readdirSync } from 'fs';
import { join } from 'path';

const models: any[] = [];

const modelsDirectory = __dirname;

// Read all files in the models directory and import them
readdirSync(modelsDirectory)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 &&
            file.slice(-3) === '.ts' &&
            file.indexOf('index.ts') === -1 // Exclude index.ts itself
        );
    })
    .forEach((file) => {
        const model = require(join(modelsDirectory, file)).default;
        if (model) models.push(model); // Only push if model is defined
    });

export { models };
