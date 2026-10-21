// apps/web/app/dashboard/academics/curriculum/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

interface GradeBoundary {
  grade: string;
  label: string;
  points: number;
  minScore: number;
  maxScore: number;
}

interface CurriculumModel {
  id: string;
  code: string;
  name: string;
  description: string;
  gradingModel: string;
  gradeBoundaries: GradeBoundary[];
  isActive: boolean;
}

interface CbcSubStrand {
  id: string;
  strandId: string;
  code: string;
  name: string;
  coreCompetency: string;
  learningOutcomes?: string;
  rubric?: {
    exceedingDescriptor: string;
    meetingDescriptor: string;
    approachingDescriptor: string;
    belowDescriptor: string;
  } | null;
}

interface CbcStrand {
  id: string;
  subjectId: string;
  subjectName: string;
  classId?: string;
  className: string;
  code: string;
  name: string;
  subStrands: CbcSubStrand[];
}

interface CbcAssessment {
  id: string;
  studentName: string;
  subjectName: string;
  strandName: string;
  subStrandName: string;
  coreCompetency: string;
  assessmentType: string;
  performanceLevel: 'EE' | 'ME' | 'AE' | 'BE';
  rubricPoints: number;
  teacherObservation: string;
  assessedAt: string;
}

interface StudentRecord {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  classId?: string | null;
  gradeLevel?: string | null;
}

export default function CurriculumAndCbcEnginePage() {
  const [curricula, setCurricula] = useState<CurriculumModel[]>([]);
  const [strands, setStrands] = useState<CbcStrand[]>([]);
  const [assessments, setAssessments] = useState<CbcAssessment[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  
  const [activeTab, setActiveTab] = useState<'cbc_assess' | 'cbc_strands' | 'frameworks'>('cbc_assess');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // CBC Step-by-Step Teacher Assessment Workflow State
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedStrandId, setSelectedStrandId] = useState('');
  const [selectedSubStrandId, setSelectedSubStrandId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [assessmentType, setAssessmentType] = useState<'Formative' | 'Summative' | 'Portfolio'>('Formative');
  const [performanceLevel, setPerformanceLevel] = useState<'EE' | 'ME' | 'AE' | 'BE'>('ME');
  const [teacherObservation, setTeacherObservation] = useState('');

  // Strand / Sub-Strand Modals
  const [strandModalOpen, setStrandModalOpen] = useState(false);
  const [subStrandModalOpen, setSubStrandModalOpen] = useState(false);
  const [newStrandSubjectId, setNewStrandSubjectId] = useState('');
  const [newStrandCode, setNewStrandCode] = useState('STR-1.0');
  const [newStrandName, setNewStrandName] = useState('');

  const [parentStrandId, setParentStrandId] = useState('');
  const [newSubCode, setNewSubCode] = useState('SUB-1.1');
  const [newSubName, setNewSubName] = useState('');
  const [newCompetency, setNewCompetency] = useState('Critical Thinking & Problem Solving');

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

  const fetchEngineData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/academics/curriculum`, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        setCurricula(json.data?.curricula || []);
        setStrands(json.data?.strands || []);
        setAssessments(json.data?.assessments || []);
        setSubjects(json.data?.subjects || []);
        setClasses(json.data?.classes || []);
        setStudents(json.data?.students || []);
      }
    } catch {
      setError('Unable to load curriculum engine.');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchEngineData();
  }, [fetchEngineData]);

  // Cascading filters for CBC Assessment Wizard
  const availableStrands = useMemo(() => {
    if (!selectedSubjectId) return strands;
    return strands.filter((s) => s.subjectId === selectedSubjectId);
  }, [strands, selectedSubjectId]);

  const activeStrandObj = useMemo(
    () => strands.find((s) => s.id === selectedStrandId) || null,
    [strands, selectedStrandId]
  );

  const activeSubStrandObj = useMemo(
    () => activeStrandObj?.subStrands.find((ss) => ss.id === selectedSubStrandId) || null,
    [activeStrandObj, selectedSubStrandId]
  );

  // Robust Student Filtering with fallback to all students if none match class filter
  const filteredStudents = useMemo(() => {
    if (!selectedClassId) return students;
    const matched = students.filter(
      (st) => st.classId === selectedClassId || st.gradeLevel === selectedClassId
    );
    return matched.length > 0 ? matched : students;
  }, [students, selectedClassId]);

  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/academics/curriculum/assessments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          studentId: selectedStudentId,
          classId: selectedClassId || null,
          subjectId: selectedSubjectId,
          strandId: selectedStrandId,
          subStrandId: selectedSubStrandId,
          assessmentType,
          performanceLevel,
          teacherObservation,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to save CBC assessment');
      setTeacherObservation('');
      setSuccessMsg('Learner CBC Rubric & Descriptive Observation saved.');
      await fetchEngineData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateStrand = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${apiUrl}/academics/curriculum/strands`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ subjectId: newStrandSubjectId, code: newStrandCode, name: newStrandName }),
    });
    if (res.ok) {
      setStrandModalOpen(false);
      setNewStrandName('');
      await fetchEngineData();
    }
  };

  const handleCreateSubStrand = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${apiUrl}/academics/curriculum/sub-strands`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        strandId: parentStrandId,
        code: newSubCode,
        name: newSubName,
        coreCompetency: newCompetency,
      }),
    });
    if (res.ok) {
      setSubStrandModalOpen(false);
      setNewSubName('');
      await fetchEngineData();
    }
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans text-[#042954]">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954]">
            Multi-Curriculum Engine (Kenya CBC, IGCSE, IB & ACE)
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Competency-based strands, descriptive rubrics (EE, ME, AE, BE), and international grading frameworks.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setStrandModalOpen(true)} className="h-[36px] px-3.5 rounded-xl bg-white border border-[#cbd5e1] text-xs font-bold text-[#042954]">
            + Add CBC Strand
          </button>
          <button onClick={() => setSubStrandModalOpen(true)} className="h-[36px] px-3.5 rounded-xl bg-[#042954] text-white text-xs font-bold">
            + Add Sub-Strand & Rubric
          </button>
        </div>
      </div>

      {error && <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">{error}</div>}
      {successMsg && <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-bold">{successMsg}</div>}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('cbc_assess')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cbc_assess' ? 'bg-[#042954] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Kenya CBC Learner Assessment Desk
        </button>
        <button
          onClick={() => setActiveTab('cbc_strands')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cbc_strands' ? 'bg-[#042954] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          CBC Strands, Sub-Strands & Rubrics ({strands.length})
        </button>
        <button
          onClick={() => setActiveTab('frameworks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'frameworks' ? 'bg-[#042954] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Active Frameworks: CBC / IGCSE / IB / ACE ({curricula.length})
        </button>
      </div>

      {/* TAB 1: KENYA CBC TEACHER ASSESSMENT WORKFLOW */}
      {activeTab === 'cbc_assess' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm">
            <h3 className="text-sm font-extrabold text-[#042954] mb-1">CBC Competency & Rubric Assessment</h3>
            <p className="text-[11px] text-[#64748b] mb-4">
              Select Class → Learning Area → Strand → Sub-Strand → Rubric → Learner Observation
            </p>

            <form onSubmit={handleSaveAssessment} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-slate-500 block mb-1">1. Select Class</label>
                  <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                    <option value="">All Classes ({students.length} Total)</option>
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-bold uppercase text-slate-500 block mb-1">2. Learning Area *</label>
                  <select required value={selectedSubjectId} onChange={(e) => { setSelectedSubjectId(e.target.value); setSelectedStrandId(''); }} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                    <option value="">-- Select Subject --</option>
                    {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-slate-500 block mb-1">3. Select Strand *</label>
                  <select required value={selectedStrandId} onChange={(e) => { setSelectedStrandId(e.target.value); setSelectedSubStrandId(''); }} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                    <option value="">-- Choose Strand --</option>
                    {availableStrands.map((st) => <option key={st.id} value={st.id}>{st.code} - {st.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-bold uppercase text-slate-500 block mb-1">4. Sub-Strand *</label>
                  <select required value={selectedSubStrandId} onChange={(e) => setSelectedSubStrandId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                    <option value="">-- Choose Sub-Strand --</option>
                    {(activeStrandObj?.subStrands || []).map((ss) => <option key={ss.id} value={ss.id}>{ss.code} - {ss.name}</option>)}
                  </select>
                </div>
              </div>

              {activeSubStrandObj && (
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-[11px]">
                  <span className="font-bold text-[#042954]">Target Competency:</span>{' '}
                  <span className="text-[#0ea5e9] font-semibold">{activeSubStrandObj.coreCompetency}</span>
                </div>
              )}

              <div>
                <label className="font-bold uppercase text-slate-500 block mb-1">
                  5. Select Learner * ({filteredStudents.length} available)
                </label>
                <select required value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                  <option value="">-- Choose Student from DB --</option>
                  {filteredStudents.map((st) => (
                    <option key={st.id} value={st.id}>{st.firstName} {st.lastName} ({st.admissionNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold uppercase text-slate-500 block mb-1.5">6. Performance Rubric Level *</label>
                <div className="grid grid-cols-4 gap-2">
                  {([
                    ['EE', 'Exceeding (4)', 'border-emerald-500 bg-emerald-50 text-emerald-800'],
                    ['ME', 'Meeting (3)', 'border-sky-500 bg-sky-50 text-sky-800'],
                    ['AE', 'Approaching (2)', 'border-amber-500 bg-amber-50 text-amber-800'],
                    ['BE', 'Below (1)', 'border-rose-500 bg-rose-50 text-rose-800'],
                  ] as const).map(([lvl, label, activeCls]) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => {
                        setPerformanceLevel(lvl);
                        if (activeSubStrandObj?.rubric) {
                          const desc =
                            lvl === 'EE'
                              ? activeSubStrandObj.rubric.exceedingDescriptor
                              : lvl === 'ME'
                              ? activeSubStrandObj.rubric.meetingDescriptor
                              : lvl === 'AE'
                              ? activeSubStrandObj.rubric.approachingDescriptor
                              : activeSubStrandObj.rubric.belowDescriptor;
                          setTeacherObservation(desc);
                        }
                      }}
                      className={`py-2 px-2 rounded-xl border text-center font-bold transition-all ${
                        performanceLevel === lvl ? `${activeCls} border-2` : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <div className="text-sm">{lvl}</div>
                      <div className="text-[9px]">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold uppercase text-slate-500 block mb-1">7. Teacher Observation *</label>
                <textarea
                  rows={3}
                  required
                  value={teacherObservation}
                  onChange={(e) => setTeacherObservation(e.target.value)}
                  placeholder="Descriptive qualitative observation of learner competency..."
                  className="w-full p-3 rounded-xl border border-slate-300"
                />
              </div>

              <button type="submit" className="w-full h-10 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white font-bold shadow-md">
                Save CBC Learner Assessment
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#042954]">Recorded CBC Assessments ({assessments.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500">
                    <th className="py-3 px-4">Learner</th>
                    <th className="py-3 px-4">Learning Area / Strand</th>
                    <th className="py-3 px-4">Rubric</th>
                    <th className="py-3 px-4">Teacher Observation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assessments.length > 0 ? (
                    assessments.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-[#042954]">{a.studentName}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#042954]">{a.subjectName}</div>
                          <div className="text-[11px] text-slate-500">{a.strandName} → {a.subStrandName}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full font-extrabold bg-sky-50 text-[#0ea5e9] border border-sky-200">
                            {a.performanceLevel} ({a.rubricPoints} pts)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs">{a.teacherObservation}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="py-12 text-center text-slate-400">No CBC learner observations recorded yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STRANDS & SUB-STRANDS CATALOG */}
      {activeTab === 'cbc_strands' && (
        <div className="space-y-4">
          {strands.length > 0 ? (
            strands.map((st) => (
              <div key={st.id} className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#0ea5e9] mr-2">{st.code}</span>
                    <span className="text-base font-extrabold text-[#042954]">{st.name}</span>
                    <span className="ml-3 text-xs text-slate-500">({st.subjectName})</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {st.subStrands.map((ss) => (
                    <div key={ss.id} className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200 text-xs">
                      <div className="font-bold text-[#042954]">{ss.code}: {ss.name}</div>
                      <div className="text-[11px] text-[#0ea5e9] font-semibold mt-0.5">Competency: {ss.coreCompetency}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-400 border border-slate-200">
              No CBC Strands created yet. Click <strong>+ Add CBC Strand</strong> above to begin.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CONFIGURABLE CURRICULUM FRAMEWORKS */}
      {activeTab === 'frameworks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {curricula.map((cur) => (
            <div key={cur.id} className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#042954] text-white">{cur.code}</span>
                <span className="text-xs font-bold text-emerald-600">{cur.gradingModel}</span>
              </div>
              <h3 className="text-base font-extrabold text-[#042954] mt-2">{cur.name}</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">{cur.description}</p>
              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                {(cur.gradeBoundaries || []).map((gb, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-50">
                    <span className="font-bold text-[#042954]">{gb.grade} — {gb.label}</span>
                    <span className="font-mono text-slate-500">{gb.minScore}% – {gb.maxScore}% ({gb.points} pts)</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Strand */}
      {strandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-xs">
            <h3 className="text-base font-extrabold text-[#042954] mb-3">Create CBC Strand</h3>
            <form onSubmit={handleCreateStrand} className="space-y-3">
              <select required value={newStrandSubjectId} onChange={(e) => setNewStrandSubjectId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                <option value="">-- Select Learning Area (Subject) --</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input type="text" required value={newStrandCode} onChange={(e) => setNewStrandCode(e.target.value)} placeholder="Code (e.g. STR-1.0)" className="w-full h-9 px-3 rounded-xl border border-slate-300" />
              <input type="text" required value={newStrandName} onChange={(e) => setNewStrandName(e.target.value)} placeholder="Strand Name (e.g. Numbers)" className="w-full h-9 px-3 rounded-xl border border-slate-300" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setStrandModalOpen(false)} className="px-4 py-2 rounded-xl border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#042954] text-white font-bold">Save Strand</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Sub-Strand */}
      {subStrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-xs">
            <h3 className="text-base font-extrabold text-[#042954] mb-3">Create CBC Sub-Strand & Rubric</h3>
            <form onSubmit={handleCreateSubStrand} className="space-y-3">
              <select required value={parentStrandId} onChange={(e) => setParentStrandId(e.target.value)} className="w-full h-9 px-3 rounded-xl border border-slate-300 bg-white">
                <option value="">-- Select Parent Strand --</option>
                {strands.map((s) => <option key={s.id} value={s.id}>{s.code} - {s.name} ({s.subjectName})</option>)}
              </select>
              <input type="text" required value={newSubCode} onChange={(e) => setNewSubCode(e.target.value)} placeholder="Sub-Strand Code (SUB-1.1)" className="w-full h-9 px-3 rounded-xl border border-slate-300" />
              <input type="text" required value={newSubName} onChange={(e) => setNewSubName(e.target.value)} placeholder="Sub-Strand Title" className="w-full h-9 px-3 rounded-xl border border-slate-300" />
              <input type="text" required value={newCompetency} onChange={(e) => setNewCompetency(e.target.value)} placeholder="Core Competency" className="w-full h-9 px-3 rounded-xl border border-slate-300" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setSubStrandModalOpen(false)} className="px-4 py-2 rounded-xl border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#042954] text-white font-bold">Save Sub-Strand</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}