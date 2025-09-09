# AyurSutra MVP - Development Guide

## MVP Scope Definition

The Minimum Viable Product (MVP) for AyurSutra focuses on the core functionality needed to demonstrate the value proposition of automated Panchakarma therapy management.

### MVP Features (Must Have)
1. **User Authentication & Roles**
   - Patient registration and login
   - Practitioner registration and login
   - Basic admin functionality

2. **Basic Patient Management**
   - Patient profile creation
   - Basic medical history form
   - Contact information management

3. **Simple Therapy Scheduling**
   - Therapy type selection (5-10 common Panchakarma procedures)
   - Basic appointment booking
   - Calendar view for practitioners
   - Simple availability management

4. **Core Notification System**
   - In-app notifications for appointments
   - Basic email notifications
   - Pre-procedure reminders (24 hours before)
   - Post-procedure follow-up reminders

5. **Basic Progress Tracking**
   - Session completion marking
   - Simple progress notes
   - Basic patient feedback form

### Features NOT in MVP (Future Versions)
- SMS notifications
- Advanced analytics and reporting
- Complex scheduling algorithms
- Mobile app
- Integration with external systems
- Advanced visualization tools
- Multi-facility management

## Development Roadmap

### Week 1: Project Foundation
- [ ] Backend API structure setup
- [ ] Database connection and basic models
- [ ] Frontend React app initialization
- [ ] Authentication system implementation
- [ ] Basic routing structure

### Week 2: Core Entities
- [ ] Patient management (CRUD operations)
- [ ] Practitioner management (CRUD operations)
- [ ] Therapy types setup
- [ ] Basic UI components library

### Week 3: Scheduling System
- [ ] Appointment booking functionality
- [ ] Calendar integration
- [ ] Basic availability management
- [ ] Appointment conflict checking

### Week 4: Notifications & Progress
- [ ] In-app notification system
- [ ] Email notification service
- [ ] Basic progress tracking
- [ ] Patient dashboard

### Week 5: Integration & Testing
- [ ] End-to-end integration
- [ ] Basic testing implementation
- [ ] Bug fixes and refinements
- [ ] MVP deployment preparation

## Implementation Priority

### Phase 1: Foundation (Days 1-7)
```
Priority 1: Authentication & Database Setup
Priority 2: Basic API structure
Priority 3: Frontend initialization
Priority 4: User models and roles
```

### Phase 2: Core Features (Days 8-21)
```
Priority 1: Patient registration and management
Priority 2: Basic scheduling system
Priority 3: Therapy type management
Priority 4: Practitioner dashboard
```

### Phase 3: Notifications (Days 22-28)
```
Priority 1: In-app notifications
Priority 2: Email notification service
Priority 3: Reminder system
Priority 4: Progress tracking
```

### Phase 4: Polish (Days 29-35)
```
Priority 1: UI/UX improvements
Priority 2: Testing and bug fixes
Priority 3: Documentation
Priority 4: Deployment setup
```

## Technology Stack for MVP

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Nodemailer** for email notifications
- **bcrypt** for password hashing

### Frontend  
- **React.js** (Create React App)
- **Material-UI** for quick, professional UI
- **React Router** for navigation
- **Axios** for API calls
- **React Hook Form** for form handling

### Database Collections (MVP)

#### users
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: String, // 'patient', 'practitioner', 'admin'
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### patients
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // reference to users
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  phone: String,
  address: Object,
  medicalHistory: {
    allergies: [String],
    currentConditions: [String],
    medications: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### practitioners
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // reference to users
  firstName: String,
  lastName: String,
  specializations: [String],
  experience: Number,
  availability: {
    monday: { start: String, end: String, available: Boolean },
    tuesday: { start: String, end: String, available: Boolean },
    // ... other days
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### therapies
```javascript
{
  _id: ObjectId,
  name: String, // e.g., "Abhyanga", "Shirodhara"
  description: String,
  duration: Number, // in minutes
  price: Number,
  preProcedureInstructions: [String],
  postProcedureInstructions: [String],
  contraindications: [String],
  isActive: Boolean
}
```

#### appointments
```javascript
{
  _id: ObjectId,
  patientId: ObjectId,
  practitionerId: ObjectId,
  therapyId: ObjectId,
  dateTime: Date,
  duration: Number,
  status: String, // 'scheduled', 'completed', 'cancelled', 'no-show'
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### notifications
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String, // 'appointment_reminder', 'pre_procedure', 'post_procedure'
  title: String,
  message: String,
  isRead: Boolean,
  scheduledFor: Date,
  sentAt: Date,
  createdAt: Date
}
```

## Key User Stories for MVP

### Patient Stories
1. As a patient, I can register and create my profile
2. As a patient, I can book an appointment for a therapy session
3. As a patient, I can view my upcoming appointments
4. As a patient, I can receive reminders about my appointments
5. As a patient, I can provide feedback after a session

### Practitioner Stories
1. As a practitioner, I can register and set up my profile
2. As a practitioner, I can set my availability schedule
3. As a practitioner, I can view my appointments for the day/week
4. As a practitioner, I can mark sessions as completed
5. As a practitioner, I can add notes to patient sessions

### Admin Stories
1. As an admin, I can manage therapy types and their details
2. As an admin, I can view system usage statistics
3. As an admin, I can manage user accounts

## Success Metrics for MVP

### Functional Success
- [ ] Users can successfully register and login
- [ ] Appointments can be booked and managed
- [ ] Notifications are sent reliably
- [ ] Basic progress tracking works
- [ ] System handles 100 concurrent users

### Business Success
- [ ] Demonstrates time savings compared to manual scheduling
- [ ] Shows improved patient engagement through notifications
- [ ] Provides clear visibility into therapy progress
- [ ] Receives positive feedback from initial users

## Risk Mitigation

### Technical Risks
- **Database performance**: Start with proper indexing
- **Email delivery**: Use reliable service like SendGrid
- **Security**: Implement proper validation and sanitization

### Business Risks
- **User adoption**: Focus on intuitive UI/UX
- **Feature creep**: Stick strictly to MVP scope
- **Data accuracy**: Implement proper validation

---

*This guide will be updated as development progresses and requirements become clearer.*
