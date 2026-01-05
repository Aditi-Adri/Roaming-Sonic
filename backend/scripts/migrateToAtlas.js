const mongoose = require('mongoose');

// Local MongoDB connection
const localUri = 'mongodb://localhost:27017/roaming-sonic';

// Atlas MongoDB connection
const atlasUri = 'mongodb+srv://aditiroyadri_db_user:a5kF773HEHtF6CXk@roaming-sonic.sxkjfk2.mongodb.net/roaming-sonic?appName=roaming-sonic';

async function migrateData() {
  try {
    console.log('🔄 Connecting to local MongoDB...');
    const localConnection = await mongoose.createConnection(localUri).asPromise();
    console.log('✅ Connected to local MongoDB');

    console.log('🔄 Connecting to Atlas MongoDB...');
    const atlasConnection = await mongoose.createConnection(atlasUri).asPromise();
    console.log('✅ Connected to Atlas MongoDB');

    // Get all collections from local database
    const collections = await localConnection.db.listCollections().toArray();
    console.log(`\n📦 Found ${collections.length} collections to migrate:`);
    collections.forEach(col => console.log(`   - ${col.name}`));

    // Migrate each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n🔄 Migrating ${collectionName}...`);

      const localCollection = localConnection.db.collection(collectionName);
      const atlasCollection = atlasConnection.db.collection(collectionName);

      // Get all documents from local collection
      const documents = await localCollection.find({}).toArray();
      console.log(`   Found ${documents.length} documents`);

      if (documents.length > 0) {
        // Clear existing data in Atlas collection (optional)
        await atlasCollection.deleteMany({});
        
        // Insert all documents into Atlas
        await atlasCollection.insertMany(documents);
        console.log(`   ✅ Migrated ${documents.length} documents`);
      }
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📊 Final Atlas database status:');
    
    // Show count for each collection in Atlas
    for (const collectionInfo of collections) {
      const count = await atlasConnection.db.collection(collectionInfo.name).countDocuments();
      console.log(`   ${collectionInfo.name}: ${count} documents`);
    }

    await localConnection.close();
    await atlasConnection.close();
    console.log('\n✅ Connections closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateData();
