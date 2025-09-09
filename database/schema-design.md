# AyurSutra Database Schema Design

## Overview
The AyurSutra database is designed using MongoDB with Mongoose ODM for the Node.js backend. The schema follows a document-oriented approach optimized for the Panchakarma therapy management use case.

## Collections

### 1. users
**Purpose:** Core authentication and user management
- Primary key: `_id` (ObjectId)
- Unique constraints: `email`
- Indexes: `email`, `role`
- References: Referenced by `patients.userId` and `practitioners.userId`

### 2. patients  
**Purpose:** Patient profiles and medical information
- Primary key: `_id` (ObjectId)
- Foreign keys: `userId` → `users._id`
- Unique constraints: `userId`
- Indexes: `userId`, `firstName + lastName`, `phone`, `status`
- Virtual fields: `fullName`, `age`, `dominantConstitution`

### 3. practitioners
**Purpose:** Healthcare practitioner profiles and availability
- Primary key: `_id` (ObjectId) 
- Foreign keys: `userId` → `users._id`
- Unique constraints: `userId`
- Indexes: `userId`, `firstName + lastName`, `specializations`, `status`

### 4. therapies
**Purpose:** Panchakarma therapy types and procedures
- Primary key: `_id` (ObjectId)
- Foreign keys: `createdBy`, `updatedBy` → `users._id`
- Unique constraints: `name`
- Indexes: `name`, `category + type`, `status`, `popularity`, `averageRating`
- Text search: `name`, `sanskritName`, `description`, `benefits`, `indications`

### 5. appointments
**Purpose:** Therapy session scheduling and management
- Primary key: `_id` (ObjectId)
- Foreign keys: 
  - `patientId` → `patients._id`
  - `practitionerId` → `practitioners._id` 
  - `therapyId` → `therapies._id`
  - `createdBy` → `users._id`
- Indexes: Multiple compound indexes for efficient querying
- Validation: Conflict detection, future date validation

### 6. notifications
**Purpose:** System notifications and reminders
- Primary key: `_id` (ObjectId)
- Foreign keys: `userId` → `users._id`
- Indexes: `userId`, `type`, `scheduledFor`, `isRead`

## Key Design Decisions

### 1. User Role Separation
- Single `users` collection for authentication
- Separate `patients` and `practitioners` collections for role-specific data
- Allows for flexible user management and role-based access

### 2. Embedded vs Referenced Data
- **Embedded:** Small, static data (addresses, contact info, medical history)
- **Referenced:** Large, frequently queried data (appointments, users)
- **Hybrid:** Some fields use both approaches for flexibility

### 3. Ayurvedic-Specific Features
- Constitutional analysis (Vata, Pitta, Kapha percentages)
- Therapy categorization based on Panchakarma principles
- Seasonal recommendations and contraindications
- Traditional Sanskrit terminology alongside English names

### 4. Scheduling & Availability
- Real-time conflict detection through MongoDB queries
- Compound indexes for efficient availability checking
- Historical data preservation for rescheduling and auditing

### 5. Notification System
- Flexible notification types and channels
- Scheduled delivery support
- Read/unread status tracking
- Template-based message generation

## Performance Optimizations

### Indexing Strategy
```javascript
// Most critical indexes for query performance
patients.index({ userId: 1 })
appointments.index({ practitionerId: 1, dateTime: 1, status: 1 })
appointments.index({ patientId: 1, dateTime: -1 })
therapies.index({ status: 1, popularity: -1 })
notifications.index({ userId: 1, scheduledFor: 1 })
```

### Query Patterns
- **Dashboard queries:** Optimized with specific indexes
- **Search queries:** Text indexes on therapy content
- **Availability queries:** Compound indexes prevent full collection scans
- **Patient history:** Date-based partitioning ready

## Data Validation

### Schema-Level Validation
- Required fields enforcement
- Data type validation
- Enum value constraints
- Custom validators for business rules

### Application-Level Validation
- Cross-collection consistency checks
- Business logic validation (appointment conflicts)
- User input sanitization
- Date and time validation

## Security Considerations

### Data Protection
- Password hashing with bcrypt (salt rounds: 12)
- Sensitive fields excluded from queries by default
- Input validation and sanitization
- Rate limiting on authentication endpoints

### Access Control
- Role-based permissions (patient/practitioner/admin)
- User can only access their own data
- Practitioners can access assigned patient data
- Admins have full system access

## Scalability Considerations

### Horizontal Scaling
- Collections designed for sharding
- Patient data can be partitioned by region
- Appointments can be partitioned by date
- No cross-shard transactions required for common operations

### Vertical Scaling
- Indexes optimized for common query patterns
- Aggregation pipelines for complex reports
- Connection pooling for database connections
- Read replicas for reporting queries

## Migration Strategy

### Version Control
- Schema versions tracked in metadata collection
- Migration scripts for schema updates
- Rollback procedures for failed migrations
- Data integrity checks post-migration

### Data Evolution
- Flexible schema allows for field additions
- Default values for new fields
- Backward compatibility maintained
- Progressive migration for large datasets

---

*This schema design balances traditional Ayurvedic practices with modern software architecture principles, ensuring both cultural authenticity and technical scalability.*
