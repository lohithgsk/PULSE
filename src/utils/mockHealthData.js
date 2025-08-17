/**
 * Mock health data for OpenAI context and demonstration purposes
 */

export const mockHealthData = {
  patient: {
    id: 'patient_12345',
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    dateOfBirth: '1979-03-15',
    bloodType: 'A+',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1-555-0123'
    }
  },

  vitals: {
    recent: [
      {
        date: '2025-01-15',
        bloodPressure: { systolic: 128, diastolic: 82 },
        heartRate: 68,
        temperature: 98.6,
        weight: 175,
        height: 69,
        oxygenSaturation: 98
      },
      {
        date: '2025-01-01',
        bloodPressure: { systolic: 135, diastolic: 88 },
        heartRate: 72,
        temperature: 98.4,
        weight: 177,
        height: 69,
        oxygenSaturation: 97
      },
      {
        date: '2024-12-15',
        bloodPressure: { systolic: 142, diastolic: 92 },
        heartRate: 75,
        temperature: 98.7,
        weight: 178,
        height: 69,
        oxygenSaturation: 98
      }
    ],
    trends: {
      bloodPressure: 'improving',
      weight: 'declining',
      heartRate: 'stable'
    }
  },

  medications: {
    current: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        prescribedDate: '2024-10-15',
        prescribedBy: 'Dr. Sarah Johnson',
        purpose: 'Blood pressure management',
        sideEffects: ['Dizziness', 'Dry cough'],
        instructions: 'Take at the same time each day, preferably in the morning'
      },
      {
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily at bedtime',
        prescribedDate: '2024-11-01',
        prescribedBy: 'Dr. Sarah Johnson',
        purpose: 'Cholesterol management',
        sideEffects: ['Muscle pain', 'Fatigue'],
        instructions: 'Take with or without food, avoid grapefruit juice'
      },
      {
        name: 'Vitamin D3',
        dosage: '2000 IU',
        frequency: 'Daily',
        prescribedDate: '2024-08-20',
        prescribedBy: 'Dr. Sarah Johnson',
        purpose: 'Vitamin D deficiency',
        sideEffects: ['None reported'],
        instructions: 'Take with meals for better absorption'
      }
    ],
    history: [
      {
        name: 'Metoprolol',
        dosage: '25mg',
        frequency: 'Twice daily',
        prescribedDate: '2024-05-01',
        discontinuedDate: '2024-10-10',
        reason: 'Switched to Lisinopril for better efficacy'
      }
    ]
  },

  labResults: {
    recent: [
      {
        date: '2025-01-10',
        type: 'Comprehensive Metabolic Panel',
        results: {
          'Total Cholesterol': { value: 185, unit: 'mg/dL', range: '<200', status: 'normal' },
          'LDL Cholesterol': { value: 110, unit: 'mg/dL', range: '<100', status: 'borderline' },
          'HDL Cholesterol': { value: 55, unit: 'mg/dL', range: '>40', status: 'good' },
          'Triglycerides': { value: 120, unit: 'mg/dL', range: '<150', status: 'normal' },
          'Glucose (Fasting)': { value: 95, unit: 'mg/dL', range: '70-99', status: 'normal' },
          'Vitamin D': { value: 45, unit: 'ng/mL', range: '30-100', status: 'optimal' },
          'Hemoglobin A1c': { value: 5.4, unit: '%', range: '<5.7', status: 'normal' }
        },
        orderedBy: 'Dr. Sarah Johnson',
        notes: 'Improvement in cholesterol levels since starting Atorvastatin. Vitamin D levels excellent after supplementation.'
      },
      {
        date: '2024-10-15',
        type: 'Lipid Panel',
        results: {
          'Total Cholesterol': { value: 220, unit: 'mg/dL', range: '<200', status: 'high' },
          'LDL Cholesterol': { value: 145, unit: 'mg/dL', range: '<100', status: 'high' },
          'HDL Cholesterol': { value: 48, unit: 'mg/dL', range: '>40', status: 'normal' },
          'Triglycerides': { value: 165, unit: 'mg/dL', range: '<150', status: 'borderline' }
        },
        orderedBy: 'Dr. Sarah Johnson',
        notes: 'Elevated cholesterol levels, started on Atorvastatin therapy'
      }
    ]
  },

  allergies: [
    {
      allergen: 'Shellfish',
      severity: 'Moderate',
      reaction: 'Hives, swelling',
      discoveredDate: '2024-12-01',
      notes: 'Developed during adulthood, avoid all shellfish'
    },
    {
      allergen: 'Penicillin',
      severity: 'Mild',
      reaction: 'Skin rash',
      discoveredDate: '1995-06-15',
      notes: 'Childhood allergy, use alternative antibiotics'
    }
  ],

  medicalHistory: {
    chronic: [
      {
        condition: 'Hypertension',
        diagnosedDate: '2024-10-15',
        status: 'Controlled',
        diagnosedBy: 'Dr. Sarah Johnson',
        notes: 'Well controlled with Lisinopril, regular monitoring required'
      },
      {
        condition: 'Hyperlipidemia',
        diagnosedDate: '2024-10-15',
        status: 'Improving',
        diagnosedBy: 'Dr. Sarah Johnson',
        notes: 'Responding well to Atorvastatin therapy and lifestyle changes'
      }
    ],
    surgeries: [
      {
        procedure: 'Appendectomy',
        date: '1998-07-22',
        surgeon: 'Dr. Michael Chen',
        hospital: 'General Hospital',
        complications: 'None',
        notes: 'Routine laparoscopic procedure, full recovery'
      }
    ],
    familyHistory: [
      {
        relation: 'Father',
        conditions: ['Coronary Artery Disease', 'Type 2 Diabetes'],
        ageAtDiagnosis: { 'Coronary Artery Disease': 52, 'Type 2 Diabetes': 58 },
        notes: 'Passed away at age 72 from heart complications'
      },
      {
        relation: 'Mother',
        conditions: ['Hypertension', 'Osteoporosis'],
        ageAtDiagnosis: { 'Hypertension': 48, 'Osteoporosis': 65 },
        notes: 'Living, conditions well managed'
      }
    ]
  },

  appointments: {
    upcoming: [
      {
        date: '2025-03-15',
        time: '10:00 AM',
        provider: 'Dr. Robert Wilson',
        specialty: 'Cardiology',
        type: 'Follow-up',
        reason: 'Blood pressure monitoring and medication review',
        location: 'Cardiology Associates'
      },
      {
        date: '2025-04-20',
        time: '2:00 PM',
        provider: 'Dr. Sarah Johnson',
        specialty: 'Primary Care',
        type: 'Annual Physical',
        reason: 'Comprehensive health examination',
        location: 'Primary Care Clinic'
      }
    ],
    recent: [
      {
        date: '2025-01-10',
        time: '9:00 AM',
        provider: 'Dr. Sarah Johnson',
        specialty: 'Primary Care',
        type: 'Follow-up',
        reason: 'Lab results review and medication adjustment',
        location: 'Primary Care Clinic',
        notes: 'Cholesterol improved, continue current medications'
      }
    ]
  },

  immunizations: [
    {
      vaccine: 'COVID-19 (Updated)',
      date: '2024-09-15',
      manufacturer: 'Pfizer-BioNTech',
      lotNumber: 'ABC123',
      provider: 'CVS Pharmacy',
      nextDue: '2025-09-15'
    },
    {
      vaccine: 'Influenza (Seasonal)',
      date: '2024-10-01',
      manufacturer: 'Sanofi',
      lotNumber: 'FLU456',
      provider: 'Primary Care Clinic',
      nextDue: '2025-10-01'
    },
    {
      vaccine: 'Tdap',
      date: '2022-03-10',
      manufacturer: 'GSK',
      lotNumber: 'TDP789',
      provider: 'Primary Care Clinic',
      nextDue: '2032-03-10'
    }
  ],

  lifestyle: {
    exercise: {
      frequency: '3-4 times per week',
      types: ['Walking', 'Swimming', 'Light weightlifting'],
      duration: '45-60 minutes per session',
      notes: 'Started regular exercise routine in October 2024'
    },
    diet: {
      type: 'Mediterranean-style',
      restrictions: ['Shellfish avoidance', 'Low sodium'],
      notes: 'Working with nutritionist to reduce cholesterol'
    },
    smoking: {
      status: 'Never smoker',
      notes: 'No tobacco use history'
    },
    alcohol: {
      status: 'Moderate consumption',
      details: '1-2 glasses wine per week',
      notes: 'Occasional social drinking only'
    },
    sleep: {
      hoursPerNight: '7-8 hours',
      quality: 'Good',
      issues: 'None reported',
      notes: 'Regular sleep schedule, no sleep disorders'
    }
  },

  riskFactors: [
    {
      factor: 'Family History of Heart Disease',
      level: 'High',
      modifiable: false,
      notes: 'Father had coronary artery disease'
    },
    {
      factor: 'Hypertension',
      level: 'Medium',
      modifiable: true,
      notes: 'Well controlled with medication'
    },
    {
      factor: 'Previous High Cholesterol',
      level: 'Low',
      modifiable: true,
      notes: 'Improving with treatment and lifestyle changes'
    }
  ],

  emergencyInformation: {
    primaryEmergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1-555-0123',
      address: '123 Main St, Anytown, ST 12345'
    },
    secondaryEmergencyContact: {
      name: 'Michael Doe',
      relationship: 'Brother',
      phone: '+1-555-0456',
      address: '456 Oak Ave, Nearby City, ST 12346'
    },
    medicalDirectives: {
      advanceDirective: true,
      dateCreated: '2024-01-15',
      location: 'With attorney and family',
      organDonor: true
    }
  }
};

export default mockHealthData;