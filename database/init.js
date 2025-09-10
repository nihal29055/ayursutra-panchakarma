// MongoDB initialization script for AyurSutra
// This script runs when the MongoDB container starts for the first time

// Switch to the ayursutra database
db = db.getSiblingDB('ayursutra');

// Create collections with validation rules
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'role'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Email must be a valid email address'
        },
        password: {
          bsonType: 'string',
          minLength: 6,
          description: 'Password must be at least 6 characters long'
        },
        role: {
          bsonType: 'string',
          enum: ['patient', 'practitioner', 'admin'],
          description: 'Role must be one of: patient, practitioner, admin'
        },
        isActive: {
          bsonType: 'bool',
          description: 'isActive must be a boolean'
        }
      }
    }
  }
});

db.createCollection('patients', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'phone'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'userId must be a valid ObjectId'
        },
        firstName: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 50,
          description: 'First name is required and must be 1-50 characters'
        },
        lastName: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 50,
          description: 'Last name is required and must be 1-50 characters'
        },
        gender: {
          bsonType: 'string',
          enum: ['male', 'female', 'other', 'prefer-not-to-say'],
          description: 'Gender must be one of the specified values'
        },
        status: {
          bsonType: 'string',
          enum: ['active', 'inactive', 'suspended'],
          description: 'Status must be one of: active, inactive, suspended'
        }
      }
    }
  }
});

db.createCollection('practitioners', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'firstName', 'lastName', 'specializations', 'experience'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'userId must be a valid ObjectId'
        },
        firstName: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 50,
          description: 'First name is required and must be 1-50 characters'
        },
        lastName: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 50,
          description: 'Last name is required and must be 1-50 characters'
        },
        specializations: {
          bsonType: 'array',
          items: {
            bsonType: 'string',
            enum: ['panchakarma', 'abhyanga', 'shirodhara', 'basti', 'vamana', 'virechana', 'nasya', 'raktamokshana', 'kayachikitsa', 'bahyachikitsa', 'general_consultation', 'pulse_diagnosis', 'constitution_analysis']
          },
          description: 'Specializations must be an array of valid specialization strings'
        },
        status: {
          bsonType: 'string',
          enum: ['active', 'inactive', 'suspended', 'on-leave'],
          description: 'Status must be one of: active, inactive, suspended, on-leave'
        }
      }
    }
  }
});

db.createCollection('therapies', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'category', 'type', 'description', 'duration', 'pricing'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100,
          description: 'Therapy name is required and must be 1-100 characters'
        },
        category: {
          bsonType: 'string',
          enum: ['purvakarma', 'pradhanakarma', 'paschatkarma', 'kayachikitsa', 'bahyachikitsa'],
          description: 'Category must be one of the valid Panchakarma categories'
        },
        type: {
          bsonType: 'string',
          enum: ['vamana', 'virechana', 'basti', 'nasya', 'raktamokshana', 'abhyanga', 'shirodhara', 'pizhichil', 'udvartana', 'kizhi', 'steam', 'consultation', 'other'],
          description: 'Type must be one of the valid therapy types'
        },
        duration: {
          bsonType: 'int',
          minimum: 15,
          maximum: 480,
          description: 'Duration must be between 15 and 480 minutes'
        },
        status: {
          bsonType: 'string',
          enum: ['active', 'inactive', 'seasonal', 'discontinued'],
          description: 'Status must be one of: active, inactive, seasonal, discontinued'
        }
      }
    }
  }
});

db.createCollection('appointments', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['patientId', 'practitionerId', 'therapyId', 'dateTime', 'duration', 'status'],
      properties: {
        patientId: {
          bsonType: 'objectId',
          description: 'patientId must be a valid ObjectId'
        },
        practitionerId: {
          bsonType: 'objectId',
          description: 'practitionerId must be a valid ObjectId'
        },
        therapyId: {
          bsonType: 'objectId',
          description: 'therapyId must be a valid ObjectId'
        },
        dateTime: {
          bsonType: 'date',
          description: 'dateTime must be a valid date'
        },
        duration: {
          bsonType: 'int',
          minimum: 15,
          description: 'Duration must be at least 15 minutes'
        },
        status: {
          bsonType: 'string',
          enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show', 'rescheduled'],
          description: 'Status must be one of the valid appointment statuses'
        },
        paymentStatus: {
          bsonType: 'string',
          enum: ['pending', 'partial', 'paid', 'refunded'],
          description: 'Payment status must be one of the valid payment statuses'
        }
      }
    }
  }
});

db.createCollection('notifications', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'type', 'title', 'message'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'userId must be a valid ObjectId'
        },
        type: {
          bsonType: 'string',
          enum: ['appointment_reminder', 'pre_procedure', 'post_procedure', 'system', 'promotional'],
          description: 'Type must be one of the valid notification types'
        },
        title: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 200,
          description: 'Title is required and must be 1-200 characters'
        },
        message: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 1000,
          description: 'Message is required and must be 1-1000 characters'
        },
        isRead: {
          bsonType: 'bool',
          description: 'isRead must be a boolean'
        }
      }
    }
  }
});

// Create indexes for better performance
print('Creating indexes...');

// Users indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });

// Patients indexes
db.patients.createIndex({ userId: 1 }, { unique: true });
db.patients.createIndex({ firstName: 1, lastName: 1 });
db.patients.createIndex({ phone: 1 });
db.patients.createIndex({ status: 1 });
db.patients.createIndex({ createdAt: -1 });

// Practitioners indexes
db.practitioners.createIndex({ userId: 1 }, { unique: true });
db.practitioners.createIndex({ firstName: 1, lastName: 1 });
db.practitioners.createIndex({ specializations: 1 });
db.practitioners.createIndex({ status: 1 });
db.practitioners.createIndex({ 'ratings.averageRating': -1 });
db.practitioners.createIndex({ joinDate: -1 });

// Therapies indexes
db.therapies.createIndex({ name: 1 }, { unique: true });
db.therapies.createIndex({ category: 1, type: 1 });
db.therapies.createIndex({ status: 1 });
db.therapies.createIndex({ popularity: -1 });
db.therapies.createIndex({ averageRating: -1 });
db.therapies.createIndex({ 'pricing.basePrice': 1 });

// Appointments indexes
db.appointments.createIndex({ patientId: 1, dateTime: -1 });
db.appointments.createIndex({ practitionerId: 1, dateTime: 1 });
db.appointments.createIndex({ therapyId: 1 });
db.appointments.createIndex({ dateTime: 1 });
db.appointments.createIndex({ status: 1 });
db.appointments.createIndex({ paymentStatus: 1 });
db.appointments.createIndex({ practitionerId: 1, dateTime: 1, status: 1 });

// Notifications indexes
db.notifications.createIndex({ userId: 1 });
db.notifications.createIndex({ type: 1 });
db.notifications.createIndex({ scheduledFor: 1 });
db.notifications.createIndex({ isRead: 1 });
db.notifications.createIndex({ userId: 1, scheduledFor: 1 });

// Text search indexes
db.therapies.createIndex({
  name: 'text',
  sanskritName: 'text',
  description: 'text',
  benefits: 'text',
  indications: 'text'
});

db.practitioners.createIndex({
  firstName: 'text',
  lastName: 'text',
  bio: 'text',
  specializations: 'text'
});

print('Database initialization completed successfully!');
print('Collections created: users, patients, practitioners, therapies, appointments, notifications');
print('Indexes created for optimal query performance');
print('Validation rules applied to ensure data integrity');
