import fs from 'fs';
import path from 'path';
import axios from 'axios';
import xml2js from 'xml2js';

const getFieldIfExists = (obj, field) => (obj && obj[field]) ? obj[field][0] : undefined;

const parseXmlToJson = (contractElement) => {
    const attributes = contractElement['$'];
    const getAttributeExists = (field, fieldName) => {
        return field ? field : `${fieldName} not found`;
    };

    const contractData = {        
        tipocontrato: getAttributeExists(attributes['tipocontrato'], 'tipocontrato'), // Tipo de contrato
        codigo: getAttributeExists(attributes['codigo'], 'codigo'), // Codiog Expediente
        descripcion: getAttributeExists(attributes['descripcion'], 'descripcion'), // Descripcion del contrato
        licitadores: getFieldIfExists(contractElement.licitadores[0], 'licitador')
            ? contractElement.licitadores[0].licitador.map((licitador) => ({
                dnilic: getFieldIfExists(licitador, 'dnilic'), // CIF/NIF del licitador
                nombrelic: getFieldIfExists(licitador, 'nombrelic'), // Nombre del licitador
            }))
            : [],
        adjudicatarios: getFieldIfExists(contractElement.adjudicatarios[0], 'adjudicatario')
            ? contractElement.adjudicatarios[0].adjudicatario.map((adjudicatario) => ({
                dniadj: getFieldIfExists(adjudicatario, 'dniadj'), // CIF/NIF del adjudicatario
                nombreadj: getFieldIfExists(adjudicatario, 'nombreadj'), // Nombre del adjudicatario
            }))
            : [],
        implic: getFieldIfExists(contractElement, 'implic'), // Importe de la licitacion (inc IVA)
        impofer: getFieldIfExists(contractElement, 'impofer'), // Importe de la oferta
        varialicofer: getFieldIfExists(contractElement, 'varialicofer'), // % Variacion de licitacion - Oferta
        observacionesoferta: getFieldIfExists(contractElement, 'observacionesoferta'),
        impadj: getFieldIfExists(contractElement, 'impadj'),
        imppagos: getFieldIfExists(contractElement, 'imppagos'),
        plazoejec: getFieldIfExists(contractElement, 'plazoejec'),
        modificaciones: getFieldIfExists(contractElement, 'modificaciones'),
        variaoferpago: getFieldIfExists(contractElement, 'variaoferpago'),
        varialicpago: getFieldIfExists(contractElement, 'varialicpago'),
        porccaractersocial: getFieldIfExists(contractElement, 'porccaractersocial'),
        obligsubrogacion: getFieldIfExists(contractElement, 'obligsubrogacion'),
        iddocccc: getFieldIfExists(contractElement, 'iddocccc'), // Link del documento oficial
        actas: getFieldIfExists(contractElement.actas[0], 'acta')
            ? contractElement.actas[0].acta.map((acta) => ({
                descripcion: getAttributeExists(acta['$']['descripcion'], 'descripcion'), // Descripcion del acta
                iddocacta: getFieldIfExists(acta, 'iddocacta'), // Link del acta
            }))
            : [],
        proyectos: getFieldIfExists(contractElement, 'proyectos'),
    };

    return contractData;
};

// URL of the XML file
const xmlUrl = 'http://167.86.102.106/opendata/386.xml';
const filename = path.basename(new URL(xmlUrl).pathname);

// Fetch XML data from the URL using axios
axios.get(xmlUrl)
    .then(async (response) => {
        const xmlData = response.data;

        // Parse XML data using xml2js
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xmlData);
        const contracts = result.contratos.contrato;

        // Convert each contract element to JSON format
        const jsonObjects = contracts.map((contract) => parseXmlToJson(contract));

        // Save all JSON objects under the same filename "parsed_all.json"
        const allJsonFileName = 'src/data/'+ filename + '.json';
        fs.writeFileSync(allJsonFileName, JSON.stringify(jsonObjects, null, 2));
        console.log('JSON objects saved:', jsonObjects.length);
    })
    .catch((error) => {
        console.error('Error fetching XML data:', error);
    });
