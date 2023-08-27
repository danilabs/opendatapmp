import fs from 'fs';
import path from 'path';
import axios from 'axios';
import xml2js from 'xml2js';
import https from 'https'; // Import the 'https' module
import crypto from 'crypto'; // Import the 'crypto' module

// URL of the XML file
// Define your list of URLs and their corresponding anyo values
const xmlUrls = [
    { anyo: '2023', folder: 'contratos', url: 'https://opendata.pamplona.es/abrirFichero.aspx?idFichero=386&idFormato=2&idioma=1&nifEntidad=P3120100G' },
    { anyo: '2022', folder: 'contratos', url: 'https://opendata.pamplona.es/abrirFichero.aspx?idFichero=369&idFormato=2&idioma=1&nifEntidad=P3120100G' },
    { anyo: '2021', folder: 'contratos', url: 'https://opendata.pamplona.es/abrirFichero.aspx?idFichero=352&idFormato=2&idioma=1&nifEntidad=P3120100G' },
];


const getFieldIfExists = (obj, field) => (obj && obj[field]) ? obj[field][0] : undefined;

const parseContractsXML2JSON = (contractElement, anyo) => {
    const attributes = contractElement['$'];
    const getAttributeExists = (field, fieldName) => {
        return field ? field : `${fieldName} not found`;
    };

    const contractData = {
        anyo: anyo,
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


const allowLegacyRenegotiationforNodeJsOptions = {
    httpsAgent: new https.Agent({
        // for self signed you could also add
        // rejectUnauthorized: false,
        // allow legacy server
        secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }),
};

// Handle the multiple URLs
xmlUrls.forEach(({ anyo, folder, url }) => {
    axios.get(url, allowLegacyRenegotiationforNodeJsOptions)
        .then(async (response) => {
            const xmlData = response.data;

            // Parse XML data using xml2js
            const parser = new xml2js.Parser();
            const result = await parser.parseStringPromise(xmlData);
            if (folder == "contratos") {
                const contracts = result.contratos.contrato;
                const jsonObjects = contracts.map((contract) => parseContractsXML2JSON(contract, anyo));

                // Save JSON objects under separate filenames based on "anyo"
                const allJsonFileName = `../data/contratos/${anyo}.json`;
                fs.writeFileSync(allJsonFileName, JSON.stringify(jsonObjects, null, 2));
                console.log(`JSON objects for ${anyo} saved:`, jsonObjects.length);
            }

        })
        .catch((error) => {
            console.error(`Error fetching XML data for ${anyo}:`, error);
        });
});