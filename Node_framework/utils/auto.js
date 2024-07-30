const sequelizeAuto = require('sequelize-auto');
const { host, user, password, database, dialect, port } = require('../db.config.js');

const options = {
	host,
	dialect,
	directory: 'models',
	port,
	additional: {
		timestamps: true,
	}
};

const auto = new sequelizeAuto(database, user, password, options);

auto.run( err => {
	if (err) throw err;
});