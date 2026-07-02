import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

const csv = `name,macroCategory,image,updatedAt,createdAt
"Grab and go","Alimentos",,,
"Preparados","Alimentos",,,
"De nuestro horno","Alimentos",,,
"All day breakfast","Alimentos",,,
"Market e impulso","Alimentos",,,
"Grab and go","Bebibas",,,
`;
fs.writeFileSync('temp.csv', csv);

async function run() {
  const form = new FormData();
  form.append('file', fs.createReadStream('temp.csv'));
  
  const res = await fetch('http://localhost:3000/api/csv/categories/import?dryRun=true', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  });
  
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
