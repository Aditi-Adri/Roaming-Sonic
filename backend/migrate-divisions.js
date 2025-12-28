const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: '../.env' });

async function migrate() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/roaming-sonic';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Find all guides
    const guides = await User.find({ userType: 'guide' });
    console.log(`Found ${guides.length} guides`);

    for (const guide of guides) {
      console.log(`\nGuide: ${guide.name}`);
      console.log('Current places:', guide.places);
      console.log('Current divisions:', guide.divisions);

      // If guide has places but no divisions, migrate
      if (guide.places && guide.places.length > 0 && (!guide.divisions || guide.divisions.length === 0)) {
        guide.divisions = guide.places;
        guide.places = undefined;
        await guide.save();
        console.log('✅ Migrated to divisions:', guide.divisions);
      } else if (guide.divisions && guide.divisions.length > 0) {
        console.log('✅ Already has divisions');
      } else {
        console.log('⚠️ No places or divisions data');
      }
    }

    console.log('\n✅ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrate();
