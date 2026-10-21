// apps/web/app/dashboard/students/medical/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

interface MedicalProfile {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  gender: string;
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  dietaryRestrictions: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  updatedAt: string;
}

interface ClinicVisit {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  visitDate: string;
  symptoms: string;
  diagnosis?: string;
  treatmentGiven: string;
  medicationPrescribed?: string;
  severity: 'Minor' | 'Moderate' | 'Emergency' | 'Referral';
  parentNotified: boolean;
  attendedBy: string;
}

interface StudentOption {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
}

export default function StudentMedicalPage() {
  const [profiles, setProfiles] = useState<MedicalProfile[]>([]);
  const [visits, setVisits] = useState<ClinicVisit[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [activeTab, setActiveTab] = useState<'profiles' | 'visits'>('profiles');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Form State
  const [studentId, setStudentId] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('None');
  const [chronicConditions, setChronicConditions] = useState('None');
  const [currentMedications, setCurrentMedications] = useState('None');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('Standard');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');

  // Clinic Visit Form State
  const [visitStudentId, setVisitStudentId] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentGiven, setTreatmentGiven] = useState('');
  const [medicationPrescribed, setMedicationPrescribed] = useState('');
  const [severity, setSeverity] = useState<'Minor' | 'Moderate' | 'Emergency' | 'Referral'>('Minor');
  const [parentNotified, setParentNotified] = useState(true);
  const [attendedBy, setAttendedBy] = useState('School Nurse');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  const getHeaders = () => {
    const token = localStorage.getItem('elimix_token');
    const storedUser = localStorage.getItem('elimix_user');
    let tenantId = '';
    if (storedUser) {
      try {
        tenantId = JSON.parse(storedUser)?.tenantId || '';
      } catch {}
    }
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenantId ? { 'x-tenant-id': tenantId } : {}),
    };
  };

  const fetchMedicalData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers = getHeaders();
      const [medRes, stuRes] = await Promise.all([
        fetch(`${apiUrl}/students/medical`, { headers }),
        fetch(`${apiUrl}/students`, { headers }),
      ]);

      if (medRes.ok) {
        const mJson = await medRes.json();
        setProfiles(mJson.data?.profiles || []);
        setVisits(mJson.data?.visits || []);
      } else {
        setError('Failed to fetch medical records from database.');
      }

      if (stuRes.ok) {
        const sJson = await stuRes.json();
        setStudents(Array.isArray(sJson.data) ? sJson.data : []);
      }
    } catch (err: any) {
      setError('Unable to reach backend server.');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchMedicalData();
  }, [fetchMedicalData]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/students/medical/profiles`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          studentId,
          bloodGroup,
          allergies,
          chronicConditions,
          currentMedications,
          dietaryRestrictions,
          emergencyContactName,
          emergencyContactPhone,
          insuranceProvider,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to save medical profile');

      setIsProfileModalOpen(false);
      await fetchMedicalData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/students/medical/visits`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          studentId: visitStudentId,
          symptoms,
          diagnosis,
          treatmentGiven,
          medicationPrescribed,
          severity,
          parentNotified,
          attendedBy,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to log clinic visit');

      setIsVisitModalOpen(false);
      setSymptoms('');
      setDiagnosis('');
      setTreatmentGiven('');
      setMedicationPrescribed('');
      await fetchMedicalData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProfiles = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return profiles.filter(
      (p) =>
        p.studentName.toLowerCase().includes(q) ||
        p.admissionNumber.toLowerCase().includes(q) ||
        p.allergies.toLowerCase().includes(q) ||
        p.chronicConditions.toLowerCase().includes(q)
    );
  }, [profiles, searchQuery]);

  const filteredVisits = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return visits.filter(
      (v) =>
        v.studentName.toLowerCase().includes(q) ||
        v.admissionNumber.toLowerCase().includes(q) ||
        v.symptoms.toLowerCase().includes(q)
    );
  }, [visits, searchQuery]);

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans text-[#042954]">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954]">Student Health & Medical Clinic</h1>
          <p className="text-[12px] text-[#64748b]">
            Restricted medical profiles, allergy alerts, dietary requirements, and infirmary visit logs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 shadow-sm flex items-center"
          >
            <i className="fa-solid fa-notes-medical mr-2 text-[#0ea5e9]"></i> Update Medical Profile
          </button>
          <button
            onClick={() => setIsVisitModalOpen(true)}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold shadow-md flex items-center"
          >
            <i className="fa-solid fa-Kit-medical mr-2"></i> Log Clinic Visit
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center justify-between">
          <span><i className="fa-solid fa-triangle-exclamation mr-2"></i>{error}</span>
          <button onClick={() => setError(null)} className="font-bold underline">Dismiss</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-[#64748b]">Medical Profiles</p>
            <h3 className="text-[24px] font-extrabold text-[#042954] mt-1">{profiles.length}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center">
            <i className="fa-solid fa-file-medical text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-[#64748b]">Allergy / Condition Alerts</p>
            <h3 className="text-[24px] font-extrabold text-amber-600 mt-1">
              {profiles.filter((p) => p.allergies !== 'None' || p.chronicConditions !== 'None').length}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <i className="fa-solid fa-heart-pulse text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-[#64748b]">Clinic Visits Logged</p>
            <h3 className="text-[24px] font-extrabold text-[#042954] mt-1">{visits.length}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center">
            <i className="fa-solid fa-user-nurse text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase text-[#64748b]">Emergency Referrals</p>
            <h3 className="text-[24px] font-extrabold text-rose-600 mt-1">
              {visits.filter((v) => v.severity === 'Emergency' || v.severity === 'Referral').length}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <i className="fa-solid fa-truck-medical text-lg"></i>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profiles' ? 'bg-[#042954] text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Student Medical Profiles ({profiles.length})
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'visits' ? 'bg-[#042954] text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Infirmary & Clinic Visits ({visits.length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Search student, admission no, allergy, symptom..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-80 h-[38px] px-3.5 rounded-xl border border-[#cbd5e1] text-xs bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
        />
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        {activeTab === 'profiles' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase">
                  <th className="py-3.5 px-5">Student</th>
                  <th className="py-3.5 px-5">Blood Group</th>
                  <th className="py-3.5 px-5">Allergies</th>
                  <th className="py-3.5 px-5">Chronic Conditions</th>
                  <th className="py-3.5 px-5">Dietary</th>
                  <th className="py-3.5 px-5">Emergency Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                {isLoading ? (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-400">Loading medical profiles...</td></tr>
                ) : filteredProfiles.length > 0 ? (
                  filteredProfiles.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="py-4 px-5">
                        <Link href={`/dashboard/students/${p.studentId}`} className="font-bold text-[#042954] hover:text-[#0ea5e9]">
                          {p.studentName}
                        </Link>
                        <div className="text-[11px] font-mono text-slate-500">{p.admissionNumber}</div>
                      </td>
                      <td className="py-4 px-5 font-bold text-rose-600">{p.bloodGroup}</td>
                      <td className="py-4 px-5">{p.allergies}</td>
                      <td className="py-4 px-5">{p.chronicConditions}</td>
                      <td className="py-4 px-5">{p.dietaryRestrictions}</td>
                      <td className="py-4 px-5 text-xs">
                        <div className="font-semibold">{p.emergencyContactName || 'Primary Guardian'}</div>
                        <div className="font-mono text-slate-500">{p.emergencyContactPhone || '-'}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-400">No medical profiles recorded yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase">
                  <th className="py-3.5 px-5">Student</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Symptoms & Diagnosis</th>
                  <th className="py-3.5 px-5">Treatment & Medication</th>
                  <th className="py-3.5 px-5">Severity</th>
                  <th className="py-3.5 px-5">Parent Notified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80">
                      <td className="py-4 px-5">
                        <div className="font-bold text-[#042954]">{v.studentName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{v.admissionNumber}</div>
                      </td>
                      <td className="py-4 px-5 text-xs">{new Date(v.visitDate).toLocaleString()}</td>
                      <td className="py-4 px-5">
                        <div className="font-semibold">{v.symptoms}</div>
                        {v.diagnosis && <div className="text-xs text-slate-500">Dx: {v.diagnosis}</div>}
                      </td>
                      <td className="py-4 px-5">
                        <div>{v.treatmentGiven}</div>
                        {v.medicationPrescribed && <div className="text-xs text-sky-600">Rx: {v.medicationPrescribed}</div>}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          v.severity === 'Emergency' || v.severity === 'Referral'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {v.severity}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-xs font-bold">
                        {v.parentNotified ? <span className="text-emerald-600">Yes</span> : <span className="text-amber-600">No</span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-400">No clinic visits logged yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal 1: Upsert Medical Profile */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-extrabold text-[#042954] mb-4">Save Student Medical Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold uppercase text-slate-500 block mb-1">Select Student *</label>
                <select
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-slate-500 block mb-1">Blood Group</label>
                  <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold uppercase text-slate-500 block mb-1">Dietary Requirement</label>
                  <input type="text" value={dietaryRestrictions} onChange={(e) => setDietaryRestrictions(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300" />
                </div>
              </div>
              <div>
                <label className="font-bold uppercase text-slate-500 block mb-1">Allergies</label>
                <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="font-bold uppercase text-slate-500 block mb-1">Chronic Conditions</label>
                <input type="text" value={chronicConditions} onChange={(e) => setChronicConditions(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-slate-500 block mb-1">Emergency Contact Name</label>
                  <input type="text" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300" />
                </div>
                <div>
                  <label className="font-bold uppercase text-slate-500 block mb-1">Emergency Phone</label>
                  <input type="text" value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-300 font-semibold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-[#042954] text-white font-semibold">
                  {isSubmitting ? 'Saving...' : 'Save Medical Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Log Clinic Visit */}
      {isVisitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-extrabold text-[#042954] mb-4">Log Infirmary / Clinic Visit</h3>
            <form onSubmit={handleLogVisit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold uppercase text-slate-500 block mb-1">Select Student *</label>
                <select required value={visitStudentId} onChange={(e) => setVisitStudentId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-slate-500 block mb-1">Severity *</label>
                  <select value={severity} onChange={(e) => setSeverity(e.target.value as any)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                    <option value="Minor">Minor</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Referral">Hospital Referral</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold uppercase text-slate-500 block mb-1">Attended By *</label>
                  <input type="text" required value={attendedBy} onChange={(e) => setAttendedBy(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300" />
                </div>
              </div>
              <div>
                <label className="font-bold uppercase text-slate-500 block mb-1">Presenting Symptoms *</label>
                <input type="text" required value={symptoms} onChange={(e) => setSymptoms(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300" />
              </div>
              <div>
                <label className="font-bold uppercase text-slate-500 block mb-1">Treatment Given *</label>
                <input type="text" required value={treatmentGiven} onChange={(e) => setTreatmentGiven(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300" />
              </div>
              <label className="flex items-center gap-2 font-semibold pt-1 cursor-pointer">
                <input type="checkbox" checked={parentNotified} onChange={(e) => setParentNotified(e.target.checked)} />
                Parent / Guardian Notified
              </label>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsVisitModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-300 font-semibold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-[#042954] text-white font-semibold">
                  {isSubmitting ? 'Logging...' : 'Save Visit Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}