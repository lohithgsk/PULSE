export function filterHealthDataByPermissions(data = {}, permissions = {}) {
  const out = {};
  out.patient = { id: data?.patient?.id };

  if (permissions?.vitals) {
    const vitals = data?.vitals || {};
    const recent = Array.isArray(vitals?.recent)
      ? vitals.recent.map(v => ({
          date: v?.date,
          bloodPressure: permissions?.blood_pressure ? v?.bloodPressure : undefined,
          heartRate: permissions?.heart_rate ? v?.heartRate : undefined,
          weight: permissions?.weight ? v?.weight : undefined,
          temperature: undefined,
          height: undefined,
          oxygenSaturation: undefined,
        }))
      : [];
    out.vitals = { recent };
  }

  if (permissions?.medications) {
    const meds = data?.medications || {};
    out.medications = {
      current: permissions?.current_meds ? meds?.current : undefined,
      history: permissions?.med_history ? meds?.history : undefined,
    };
  }

  if (permissions?.allergies) {
    out.allergies = data?.allergies;
  }

  if (permissions?.medical_records) {
    if (permissions?.lab_results) out.labResults = data?.labResults;
    const mh = data?.medicalHistory || {};
    out.medicalHistory = {
      chronic: permissions?.diagnoses ? mh?.chronic : undefined,
      surgeries: permissions?.treatments ? mh?.surgeries : undefined,
      familyHistory: undefined,
    };
  }

  if (permissions?.lifestyle) {
    const ls = data?.lifestyle || {};
    out.lifestyle = {
      exercise: permissions?.exercise ? ls?.exercise : undefined,
      diet: permissions?.diet ? ls?.diet : undefined,
      sleep: permissions?.sleep ? ls?.sleep : undefined,
    };
  }

  return out;
}

export function summarizeAllowedPermissions(permissions = {}) {
  const enabled = Object.keys(permissions).filter(k => permissions[k]);
  return enabled.join(", ");
}
