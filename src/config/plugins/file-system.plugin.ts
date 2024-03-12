import { 
    appendFileSync, 
    existsSync, 
    mkdirSync, 
    readFileSync, 
    writeFileSync
} from "fs";

const createFolderAdapter = (path: string) => {
    if (!existsSync(path)) {
        mkdirSync(path);
    }
};

const writeFileAdapter = (path: string, content: string) => {
    writeFileSync(path, content);
};

const appendFileAdapter = (path: string, content: string) => {
    appendFileSync(path, content);
};

const readFileB64Adapter = (path: string) => {
    return readFileSync(path).toString('base64');
};

export {
    createFolderAdapter,
    writeFileAdapter,
    appendFileAdapter,
    readFileB64Adapter,
};