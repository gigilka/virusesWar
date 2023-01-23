const { Client } = require('pg'); 
 
const client = new Client({ 
user: 'test', 
host: 'localhost', 
database: 'VirusesWarDB', 
password: '1234', 
port: 5432, 
}); 

let i=5567
let j=6790
client.connect(); 
const query = ` 
SELECT * 
FROM results     
`; 
client.query(query, (err, res) => { 
    if (err) { 
    console.error(err); 
    return; 
    } 
    for (let row of res.rows) { 
    console.log(row); 
    } 
    client.end(); 
    }); 