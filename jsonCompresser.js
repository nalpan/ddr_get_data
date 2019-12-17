const path = require('path');
const fs = require('fs');

if(!process.argv[2]){
  console.log('input file name');
  return;
}

const length = process.argv.length;

for(let i=2; i < length; i++){
  main(process.argv[i]);
}

function main(fileName){
  const inputPath = path.resolve(__dirname, 'resource', 'songdata', fileName);
  const json = JSON.stringify(require(inputPath));

  const outputPath = path.resolve(__dirname, 'dist', fileName);
  fs.writeFileSync(outputPath, json);
}
