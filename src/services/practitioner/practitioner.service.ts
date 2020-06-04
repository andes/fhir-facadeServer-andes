import { resolveSchema } from '@asymmetrik/node-fhir-server-core';
import { Practitioner as fhirPractitioner } from '@andes/fhir';
import { stringQueryBuilder } from './../../utils/querybuilder.util';
import { setObjectId as objectId } from './../../utils/uid.util';
const { COLLECTION, CLIENT_DB } = require('./../../constants');
const globals = require('../../globals');


let getPractitioner = (base_version) => {
	return require(resolveSchema(base_version, 'Practitioner'));
};


let buildAndesSearchQuery = (args) => {

	// Filtros de búsqueda para pacientes
	let id = args['id'];
	let active = args['active'];
	let family = args['family'];
	let given = args['given'];
	let identifier = args['identifier'];
	let query: any = {};
	if (id) {
		query.id = id;
	}
	if (active) {
		query.activo = active === true ? true : false;
	}
	if (family) {
		query.apellido = stringQueryBuilder(family);
	}
	if (given) {
		query.nombre = stringQueryBuilder(given);
	}
	if (identifier) {
		query.documento = stringQueryBuilder(identifier);
	}
	return query;
};


export = {
	search: async (args) => {
		try {
			let { base_version } = args;
			let query = buildAndesSearchQuery(args);
			const db = globals.get(CLIENT_DB);
			let collection = db.collection(`${COLLECTION.PRACTITIONER}`)
			let Practitioner = getPractitioner(base_version);
			let practitioners = await collection.find(query).toArray();
			return practitioners.map(prac => new Practitioner(fhirPractitioner.encode(prac)));
		} catch (err) {
			return err;
		}
	},
	searchById: async (args) => {
		try {
			let { base_version, id } = args;
			let Practitioner = getPractitioner(base_version);
			let db = globals.get(CLIENT_DB);
			let collection = db.collection(`${COLLECTION.PRACTITIONER}`);
			let practitioner = await collection.findOne({ _id: objectId(id) });
			return practitioner ? new Practitioner(fhirPractitioner.encode(practitioner)) : null;
		} catch (err) {
			return err;
		}
	}

};




