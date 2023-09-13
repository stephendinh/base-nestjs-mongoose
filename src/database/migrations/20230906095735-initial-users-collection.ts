module.exports = {
  async up(db, client) {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.createCollection('users');
      });
      const timeStamp = new Date();
      await db.collection('users').insertOne({
        email: 'the.do@sotatek.com',
        password: 'lh5vldk93570CogelnctWue1IN53FaOoB5gOTZrVZPRoS11QdUixS',
        firstName: 'test',
        lastName: 'ok',
        fullName: 'test ok',
        status: 'active',
        deletedAt: null,
        updateAt: timeStamp,
        createdAt: timeStamp,
      });
    } finally {
      await session.endSession();
    }
  },

  async down(db, client) {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.dropCollection('users');
      });
    } finally {
      await session.endSession();
    }
  },
};
