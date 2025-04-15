import fs from 'fs';
import readline from 'readline';
import path from 'path'
import users from './users.js'
import promptSync from 'prompt-sync';

import regex from './helpers/regex.js';
const prompt = promptSync();

let monthInput = prompt('Enter 7pay.logs date, (month "01-12"): ')
let dayInput = prompt('Enter 7pay.logs date, (day "01-31") : ')
let file = `7pay.log_2024-${monthInput}-${dayInput}`
let subDirectory = `2024-${monthInput}`;

async function extract(){
    const filestream = fs.createReadStream(file);
    const readlines = readline.createInterface({
        input: filestream,
        
        crlfDelay: Infinity
    });
    const createDirectory = (dirPath) => {
        return new Promise((resolve, reject) => {
            fs.mkdir(dirPath, { recursive: true }, (err) => {
                if (err) {
                    if (err.code === 'EEXIST') {
                        return resolve(false); 
                    }
                    return reject(err); 
                }
                resolve(true); 
            });
        });
    };

    users.forEach(async (data) => {
        try {
            let directory = path.join(data.company, `${data.name} - ${data.username}`, subDirectory);
            await createDirectory(directory);
        } catch (error) {
            console.error(`\n[ERROR] Failed to create directory: ${error.message}\n`);
        }
    });
    
    readlines.on('line', (line) => {
        users.map(user => {
            if(user.isCreated){
                if(line.match(user.username) && !line.match(regex['user-none'])){
                    user.count++
                    fs.appendFileSync(`${user.company}\\${user.name} - ${user.username}\\${subDirectory}\\${file.split('_').pop()}-${user.username}.txt`, `${line}\n`, 'utf-8');
                }
            }
        })
    })

    readlines.on('close', () => {
        console.log('\nExtraction has been completed.');
        console.log(users)
    });

}

fs.stat(file, (error, stats) => {

    if (error && error.code === 'ENOENT') {
        return console.log(`Error reading file stat: ${file} not found`);
    }

    extract();

    const totalSize = stats.size;
    let bytesRead = 0;
  
    const readlines = fs.createReadStream(file);
  
    readlines.on('data', (chunk) => {
        bytesRead += chunk.length;
        const percentage = (bytesRead / totalSize) * 100;
        console.log(`Reading File ${file}: ${percentage.toFixed(2)}%`);
    });

    readlines.on('error', (error) => {
      console.error('Error reading file:');
    });
});

// extract();