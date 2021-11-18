const csv = require('csv-parser');
const fs = require('fs');
 const readFile = (fileName)=>{
  const data = [];
  return new Promise((resolve, reject) => {
      fs.createReadStream(fileName)
        .on('error', error => {
              reject(error);
          })
        .pipe(csv())
        .on('data', (row) => {
          const n = fileName.split('/');
        data.push({...row, filename: n[n.length-1]})
        })
        .on('end', () => {
          resolve(data);
        })
  });
}
 const writeFile = (data)=>{
  try{
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
      path: 'combined.csv',
      header: [
        {id: 'email_hash', title: 'email_hash'},
        {id: 'category', title: 'category'},
        {id: 'filename', title: 'filename'}
      ]
    });
    csvWriter
      .writeRecords(data)
      .then(()=> console.log('The CSV file was written successfully'));
  }catch(ex){console.log(ex);}
}

const migrateData = async ()=>{
  // TODO: ignore starting two args
  // let inputFiles = process.argv?.filter(v=>(v!=='/usr/local/bin/node' && v!=='/Users/Yashaswini/Desktop/csvDataMerge/src/csvCombiner.js'));
  let data = [];
  for(let i=2;i<process.argv?.length;i++){
    const d =  await readFile(process.argv?.[i]);
    data = [...data, ...d];
  }
  writeFile(data);
}

(async ()=>{
  migrateData();
})();