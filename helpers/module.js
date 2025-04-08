import fs from 'fs'
import readline from 'readline';
import regex from './regex.js';

const print = async (folder, sevenpay, iso) => {
    
    const filestream = iso == 1 ? fs.createReadStream(`${folder}/${sevenpay}.txt`) : fs.createReadStream(`${folder}/${sevenpay}-noiso.txt`);
    
    const rl = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });
    console.log('\n'); 
    for await (const line of rl){
        console.log(line)
    }
} 

let iso = [];

const deleteIso = async (folder, sevenpay) => {
    const filestream = fs.createReadStream(`${folder}/${sevenpay}.txt`);
    const rl = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });

    for await (const line of rl){
        appendLine(iso, line.replace(regex['iso-packager'], ' ')
            .replace(regex['iso-incoming'], '')
            .replace(regex['iso-opening-tag'], '')
            .replace(regex['iso-closing-tag'], ''));
            if(line.match(regex['log-closing-tag'])){
                if(iso.find(data => data.match(sevenpay)) == undefined){
                    iso = [];
                } else {
                    iso.map(data => {
                        fs.appendFileSync(`${folder}/${sevenpay}-noiso.txt`, `${data}\n`,'utf-8')
                        iso = [];
                    })
                }
        }
    }
} 

const appendLine = (matches, line) => {
    matches.push(line)
}

const getTime = (time) => {
    console.log(`\nExtraction ${time} at: ${new Date().getHours()}:${new Date().getMinutes()} ${new Date().getHours() > 12 ?'PM': 'AM'}`)
}

export default { appendLine, print, deleteIso, getTime }