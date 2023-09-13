const config = {
  mongodb: {
    url: 'mongodb://root:password123@localhost:27017/nestjs-mongodb-base?authSource=admin',
    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    },
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: 'src/database/migrations',

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: 'migrationChangelog',

  // The file extension to create migrations and search for in migration dir
  migrationFileExtension: '.ts',

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determine
  // If the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: false,

  moduleSystem: 'commonjs',
};

// Return the config as a promise
module.exports = config;
