import fs from 'fs'
import path from 'path'
import promptSync from 'prompt-sync';

const prompt = promptSync();
let folder;
let today = `${new Date().getMonth() + 1}-${new Date().getDate()}-${new Date().getFullYear()}`;
let logsFolder = `logs.${today}`;

const createDirectory = () => {

    console.log(`Create a directory:\n[1] New Folder\n[2] Create (${logsFolder}) Folder`);
    
    const directory = prompt('Choice: ');

    if(directory == '1'){
        folder = prompt('Directory Name: ');
        fs.mkdir(path.join('', folder), (err) => {
            if (err) {
                if (err.code == 'EEXIST') {
                    return console.log(`\n[DIRECTORY]: ${folder} exist already!\n`);
                }
            }
            console.log(`\n[DIRECTORY] ${folder} created successfully!\n`);
        })
    } else if(directory == '2') {
        fs.mkdir(path.join('', logsFolder), (err) => {
            if (err) {
                if (err.code == 'EEXIST') {
                    return console.log(`\n[DIRECTORY]: ${logsFolder} exist already!`);
                }
            }
            console.log(`\n[DIRECTORY] ${logsFolder} created successfully!\n`);
        })       
        folder = logsFolder 
    } else {
        console.log("Invalid Choice\n")
        createDirectory();
    }
    return folder
}

export default createDirectory;