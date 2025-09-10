const mongoose = require('mongoose');
require('dotenv').config();

const Therapy = require('../models/Therapy');
const User = require('../models/User');

// Sample therapies data
const sampleTherapies = [
  {
    name: 'Abhyanga',
    sanskritName: 'अभ्यंग',
    category: 'purvakarma',
    type: 'abhyanga',
    description: 'Traditional Ayurvedic full-body oil massage that promotes relaxation, improves circulation, and balances the doshas. This therapeutic massage uses warm medicated oils to nourish the skin and calm the nervous system.',
    benefits: [
      'Improves blood circulation',
      'Reduces stress and anxiety',
      'Promotes better sleep',
      'Nourishes and moisturizes skin',
      'Strengthens muscles and joints',
      'Boosts immunity'
    ],
    indications: [
      'Stress and anxiety disorders',
      'Insomnia and sleep disturbances',
      'Muscle tension and stiffness',
      'Poor circulation',
      'Skin disorders',
      'General fatigue and weakness'
    ],
    contraindications: [
      'Fever or acute illness',
      'Open wounds or skin infections',
      'Severe hypertension',
      'Pregnancy (first trimester)',
      'Recent surgery'
    ],
    duration: 60,
    sessions: {
      recommended: 7,
      maximum: 21,
      frequency: 'daily'
    },
    preparation: {
      preProcedureInstructions: [
        {
          instruction: 'Avoid heavy meals 2 hours before the session',
          timeframe: '2 hours before',
          importance: 'recommended'
        },
        {
          instruction: 'Drink plenty of water',
          timeframe: '1 hour before',
          importance: 'recommended'
        },
        {
          instruction: 'Inform therapist of any allergies or skin conditions',
          timeframe: 'before session',
          importance: 'mandatory'
        }
      ],
      postProcedureInstructions: [
        {
          instruction: 'Rest for 30 minutes after the session',
          timeframe: 'immediately after',
          importance: 'recommended'
        },
        {
          instruction: 'Avoid showering for 2 hours to allow oil absorption',
          timeframe: '2 hours after',
          importance: 'mandatory'
        },
        {
          instruction: 'Drink warm water or herbal tea',
          timeframe: 'after session',
          importance: 'recommended'
        }
      ]
    },
    materials: {
      oils: [
        { name: 'Sesame Oil', quantity: '200ml', optional: false },
        { name: 'Coconut Oil', quantity: '100ml', optional: true },
        { name: 'Almond Oil', quantity: '50ml', optional: true }
      ],
      herbs: [
        { name: 'Ashwagandha', quantity: '10g', optional: true },
        { name: 'Brahmi', quantity: '5g', optional: true }
      ],
      equipment: ['Massage table', 'Towels', 'Oil warmer']
    },
    pricing: {
      basePrice: 1500,
      currency: 'INR',
      packageDiscount: 10
    },
    practitionerRequirements: {
      minimumExperience: 1,
      specializations: ['abhyanga', 'purvakarma'],
      certifications: ['Ayurvedic Massage Therapy']
    },
    seasonality: {
      preferredSeasons: ['winter', 'autumn'],
      avoidSeasons: ['summer']
    },
    status: 'active',
    popularity: 95,
    averageRating: 4.8,
    totalReviews: 150
  },
  {
    name: 'Shirodhara',
    sanskritName: 'शिरोधारा',
    category: 'purvakarma',
    type: 'shirodhara',
    description: 'A deeply relaxing therapy where warm medicated oil is poured in a continuous stream on the forehead (third eye area). This ancient treatment calms the mind, reduces stress, and promotes mental clarity.',
    benefits: [
      'Reduces stress and anxiety',
      'Improves sleep quality',
      'Enhances mental clarity',
      'Balances nervous system',
      'Relieves headaches and migraines',
      'Promotes emotional well-being'
    ],
    indications: [
      'Chronic stress and anxiety',
      'Insomnia and sleep disorders',
      'Headaches and migraines',
      'Mental fatigue',
      'Depression and mood disorders',
      'High blood pressure'
    ],
    contraindications: [
      'Acute fever or infection',
      'Severe hypertension',
      'Open wounds on head',
      'Recent head injury',
      'Pregnancy (first trimester)'
    ],
    duration: 45,
    sessions: {
      recommended: 7,
      maximum: 14,
      frequency: 'daily'
    },
    preparation: {
      preProcedureInstructions: [
        {
          instruction: 'Avoid caffeine 4 hours before session',
          timeframe: '4 hours before',
          importance: 'mandatory'
        },
        {
          instruction: 'Have light meal 2 hours before',
          timeframe: '2 hours before',
          importance: 'recommended'
        },
        {
          instruction: 'Remove contact lenses if wearing',
          timeframe: 'before session',
          importance: 'mandatory'
        }
      ],
      postProcedureInstructions: [
        {
          instruction: 'Rest in quiet environment for 30 minutes',
          timeframe: 'immediately after',
          importance: 'mandatory'
        },
        {
          instruction: 'Avoid bright lights and loud noises',
          timeframe: '2 hours after',
          importance: 'recommended'
        },
        {
          instruction: 'Drink warm herbal tea',
          timeframe: 'after session',
          importance: 'recommended'
        }
      ]
    },
    materials: {
      oils: [
        { name: 'Sesame Oil', quantity: '500ml', optional: false },
        { name: 'Brahmi Oil', quantity: '100ml', optional: true },
        { name: 'Jatamansi Oil', quantity: '50ml', optional: true }
      ],
      herbs: [
        { name: 'Brahmi', quantity: '20g', optional: false },
        { name: 'Jatamansi', quantity: '10g', optional: true },
        { name: 'Ashwagandha', quantity: '5g', optional: true }
      ],
      equipment: ['Shirodhara apparatus', 'Massage table', 'Towels', 'Oil warmer']
    },
    pricing: {
      basePrice: 2000,
      currency: 'INR',
      packageDiscount: 15
    },
    practitionerRequirements: {
      minimumExperience: 2,
      specializations: ['shirodhara', 'purvakarma'],
      certifications: ['Advanced Ayurvedic Therapies']
    },
    seasonality: {
      preferredSeasons: ['winter', 'monsoon'],
      avoidSeasons: ['summer']
    },
    status: 'active',
    popularity: 88,
    averageRating: 4.9,
    totalReviews: 120
  },
  {
    name: 'Basti',
    sanskritName: 'बस्ति',
    category: 'pradhanakarma',
    type: 'basti',
    description: 'Medicated enema therapy that cleanses the colon and balances Vata dosha. This powerful Panchakarma procedure removes toxins from the body and strengthens the digestive system.',
    benefits: [
      'Cleanses colon and digestive tract',
      'Balances Vata dosha',
      'Improves digestion',
      'Removes toxins from body',
      'Strengthens immune system',
      'Relieves constipation'
    ],
    indications: [
      'Chronic constipation',
      'Digestive disorders',
      'Vata imbalance',
      'Joint pain and stiffness',
      'Neurological disorders',
      'Skin problems'
    ],
    contraindications: [
      'Acute diarrhea',
      'Severe heart conditions',
      'Pregnancy',
      'Recent abdominal surgery',
      'Severe hemorrhoids',
      'Acute fever'
    ],
    duration: 30,
    sessions: {
      recommended: 8,
      maximum: 15,
      frequency: 'daily'
    },
    preparation: {
      preProcedureInstructions: [
        {
          instruction: 'Follow light diet for 3 days',
          timeframe: '3 days before',
          importance: 'mandatory'
        },
        {
          instruction: 'Avoid heavy, oily foods',
          timeframe: '1 day before',
          importance: 'mandatory'
        },
        {
          instruction: 'Empty bowels in the morning',
          timeframe: 'morning of procedure',
          importance: 'mandatory'
        }
      ],
      postProcedureInstructions: [
        {
          instruction: 'Rest for 1 hour after procedure',
          timeframe: 'immediately after',
          importance: 'mandatory'
        },
        {
          instruction: 'Follow prescribed diet',
          timeframe: 'for 3 days',
          importance: 'mandatory'
        },
        {
          instruction: 'Avoid cold foods and drinks',
          timeframe: 'for 1 week',
          importance: 'recommended'
        }
      ]
    },
    materials: {
      oils: [
        { name: 'Sesame Oil', quantity: '300ml', optional: false },
        { name: 'Castor Oil', quantity: '100ml', optional: true }
      ],
      herbs: [
        { name: 'Triphala', quantity: '30g', optional: false },
        { name: 'Haritaki', quantity: '20g', optional: true },
        { name: 'Bibhitaki', quantity: '15g', optional: true }
      ],
      equipment: ['Basti apparatus', 'Enema bag', 'Lubricant', 'Towels']
    },
    pricing: {
      basePrice: 2500,
      currency: 'INR',
      packageDiscount: 20
    },
    practitionerRequirements: {
      minimumExperience: 3,
      specializations: ['basti', 'pradhanakarma'],
      certifications: ['Panchakarma Specialist']
    },
    seasonality: {
      preferredSeasons: ['winter', 'autumn'],
      avoidSeasons: ['summer', 'monsoon']
    },
    status: 'active',
    popularity: 75,
    averageRating: 4.7,
    totalReviews: 85
  },
  {
    name: 'Vamana',
    sanskritName: 'वमन',
    category: 'pradhanakarma',
    type: 'vamana',
    description: 'Therapeutic vomiting therapy that eliminates Kapha dosha and toxins from the upper respiratory tract. This procedure is highly effective for respiratory and skin disorders.',
    benefits: [
      'Eliminates Kapha dosha',
      'Cleanses respiratory system',
      'Improves lung function',
      'Treats skin disorders',
      'Reduces mucus and phlegm',
      'Boosts immunity'
    ],
    indications: [
      'Chronic respiratory disorders',
      'Asthma and bronchitis',
      'Skin diseases',
      'Kapha imbalance',
      'Sinusitis',
      'Allergic conditions'
    ],
    contraindications: [
      'Pregnancy',
      'Severe heart conditions',
      'Recent surgery',
      'Acute fever',
      'Severe hypertension',
      'Mental disorders'
    ],
    duration: 90,
    sessions: {
      recommended: 1,
      maximum: 3,
      frequency: 'as-needed'
    },
    preparation: {
      preProcedureInstructions: [
        {
          instruction: 'Follow Kapha-increasing diet for 3 days',
          timeframe: '3 days before',
          importance: 'mandatory'
        },
        {
          instruction: 'Avoid Vata-increasing foods',
          timeframe: '1 day before',
          importance: 'mandatory'
        },
        {
          instruction: 'Empty stomach in the morning',
          timeframe: 'morning of procedure',
          importance: 'mandatory'
        }
      ],
      postProcedureInstructions: [
        {
          instruction: 'Rest for 2 hours after procedure',
          timeframe: 'immediately after',
          importance: 'mandatory'
        },
        {
          instruction: 'Follow prescribed diet for 1 week',
          timeframe: 'for 1 week',
          importance: 'mandatory'
        },
        {
          instruction: 'Avoid cold and heavy foods',
          timeframe: 'for 2 weeks',
          importance: 'recommended'
        }
      ]
    },
    materials: {
      oils: [
        { name: 'Sesame Oil', quantity: '200ml', optional: false }
      ],
      herbs: [
        { name: 'Madanaphala', quantity: '50g', optional: false },
        { name: 'Yashtimadhu', quantity: '30g', optional: true },
        { name: 'Vacha', quantity: '20g', optional: true }
      ],
      equipment: ['Vomiting apparatus', 'Buckets', 'Towels', 'Mouthwash']
    },
    pricing: {
      basePrice: 3000,
      currency: 'INR',
      packageDiscount: 0
    },
    practitionerRequirements: {
      minimumExperience: 5,
      specializations: ['vamana', 'pradhanakarma'],
      certifications: ['Advanced Panchakarma Specialist']
    },
    seasonality: {
      preferredSeasons: ['spring', 'autumn'],
      avoidSeasons: ['summer', 'winter']
    },
    status: 'active',
    popularity: 60,
    averageRating: 4.6,
    totalReviews: 45
  },
  {
    name: 'Nasya',
    sanskritName: 'नस्य',
    category: 'pradhanakarma',
    type: 'nasya',
    description: 'Nasal administration of medicated oils or powders to cleanse and nourish the nasal passages, sinuses, and head region. This therapy is excellent for head and neck disorders.',
    benefits: [
      'Cleanses nasal passages',
      'Improves sense of smell',
      'Relieves sinus congestion',
      'Treats headaches',
      'Improves voice quality',
      'Enhances mental clarity'
    ],
    indications: [
      'Chronic sinusitis',
      'Headaches and migraines',
      'Loss of smell',
      'Voice disorders',
      'Hair problems',
      'Eye disorders'
    ],
    contraindications: [
      'Acute fever',
      'Severe hypertension',
      'Pregnancy',
      'Recent nasal surgery',
      'Severe nosebleeds',
      'Acute respiratory infection'
    ],
    duration: 20,
    sessions: {
      recommended: 7,
      maximum: 14,
      frequency: 'daily'
    },
    preparation: {
      preProcedureInstructions: [
        {
          instruction: 'Avoid cold foods and drinks',
          timeframe: '1 day before',
          importance: 'recommended'
        },
        {
          instruction: 'Clear nasal passages',
          timeframe: 'before session',
          importance: 'mandatory'
        },
        {
          instruction: 'Inform of any nasal allergies',
          timeframe: 'before session',
          importance: 'mandatory'
        }
      ],
      postProcedureInstructions: [
        {
          instruction: 'Avoid cold foods for 2 hours',
          timeframe: '2 hours after',
          importance: 'mandatory'
        },
        {
          instruction: 'Gargle with warm water',
          timeframe: 'after session',
          importance: 'recommended'
        },
        {
          instruction: 'Avoid exposure to cold wind',
          timeframe: 'for 1 hour',
          importance: 'recommended'
        }
      ]
    },
    materials: {
      oils: [
        { name: 'Anu Taila', quantity: '50ml', optional: false },
        { name: 'Sesame Oil', quantity: '30ml', optional: true }
      ],
      herbs: [
        { name: 'Brahmi', quantity: '10g', optional: false },
        { name: 'Vacha', quantity: '5g', optional: true }
      ],
      equipment: ['Nasya apparatus', 'Cotton swabs', 'Tissues']
    },
    pricing: {
      basePrice: 800,
      currency: 'INR',
      packageDiscount: 15
    },
    practitionerRequirements: {
      minimumExperience: 2,
      specializations: ['nasya', 'pradhanakarma'],
      certifications: ['Ayurvedic Nasal Therapy']
    },
    seasonality: {
      preferredSeasons: ['winter', 'autumn'],
      avoidSeasons: ['summer']
    },
    status: 'active',
    popularity: 70,
    averageRating: 4.5,
    totalReviews: 65
  }
];

async function seedTherapies() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ayursutra');
    console.log('Connected to MongoDB');

    // Clear existing therapies
    await Therapy.deleteMany({});
    console.log('Cleared existing therapies');

    // Find or create admin user for createdBy field
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = new User({
        email: 'admin@ayursutra.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      });
      await adminUser.save();
      console.log('Created admin user for seeding');
    }

    // Add createdBy field to all therapies
    const therapiesWithAdmin = sampleTherapies.map(therapy => ({
      ...therapy,
      createdBy: adminUser._id,
      updatedBy: adminUser._id
    }));

    // Insert sample therapies
    const insertedTherapies = await Therapy.insertMany(therapiesWithAdmin);
    console.log(`Successfully seeded ${insertedTherapies.length} therapies`);

    // Display seeded therapies
    console.log('\nSeeded Therapies:');
    insertedTherapies.forEach(therapy => {
      console.log(`- ${therapy.name} (${therapy.sanskritName}) - ${therapy.category}`);
    });

  } catch (error) {
    console.error('Error seeding therapies:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
if (require.main === module) {
  seedTherapies();
}

module.exports = { seedTherapies, sampleTherapies };
