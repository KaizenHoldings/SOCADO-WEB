import Papa from 'papaparse';

const csv = `name,macroCategory,image,updatedAt,createdAt
"Grab and go","Alimentos",,,
"Preparados","Alimentos",,,
"De nuestro horno","Alimentos",,,
"All day breakfast","Alimentos",,,
"Market e impulso","Alimentos",,,
"Grab and go","Bebibas",,,
`;
const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true, dynamicTyping: true });
console.log(JSON.stringify(parsed, null, 2));
