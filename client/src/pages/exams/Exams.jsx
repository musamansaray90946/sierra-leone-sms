import { useState, useEffect } from 'react';
import { Plus, FileText, Download, Award } from 'lucide-react';
import { classesAPI } from '../../services/api';
import API from '../../services/api';
import toast from 'react-hot-toast';

const SUBJECTS_SL = ['Mathematics', 'English Language', 'Integrated Science', 'Social Studies', 'Civic Education', 'ICT', 'French', 'Arabic', 'Christian Religious Studies', 'Islamic Religious Studies', 'Biology', 'Chemistry', 'Physics', 'Economics', 'Literature'];

const getGrade = (score) => {
  if (score >= 75) return { grade: 'A', remark: 'Excellent', color: 'text-green-600' };
  if (score >= 65) return { grade: 'B', remark: 'Very Good', color: 'text-blue-600' };
  if (score >= 55) return { grade: 'C', remark: 'Good', color: 'text-primary-600' };
  if (score >= 45) return { grade: 'D', remark: 'Pass', color: 'text-yellow-600' };
  if (score >= 40) return { grade: 'E', remark: 'Weak Pass', color: 'text-orange-600' };
  return { grade: 'F', remark: 'Fail', color: 'text-red-600' };
};

export default function Exams() {
  const [tab, setTab] = useState('exams');
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', term: 'SECOND', classId: '', academicYearId: '', startDate: '', endDate: '' });
  const [reportCard, setReportCard] = useState({ studentName: '', admissionNo: '', class: '', term: 'SECOND', year: '2025/2026', scores: {} });

  useEffect(() => {
    API.get('/exams').then(res => setExams(res.data.data)).catch(() => {});
    classesAPI.getAll().then(res => {
      setClasses(res.data.data);
      if (res.data.data[0]) setForm(f => ({ ...f, academicYearId: res.data.data[0].academicYearId }));
    });
  }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/exams', form);
      setExams([res.data.data, ...exams]);
      toast.success('Exam created!');
      setShowForm(false);
    } catch (err) { toast.error('Failed to create exam'); }
  };

  const printReportCard = () => {
    const scores = reportCard.scores;
    const subjects = Object.keys(scores).filter(s => scores[s] !== '');
    const total = subjects.reduce((sum, s) => sum + Number(scores[s]), 0);
    const avg = subjects.length ? (total / subjects.length).toFixed(1) : 0;
    const { grade } = getGrade(Number(avg));

    const html = `
      <!DOCTYPE html><html><head><title>Report Card - ${reportCard.studentName}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
        .header { text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 20px; }
        .school-name { font-size: 22px; font-weight: bold; color: #1e3a8a; }
        .subtitle { font-size: 13px; color: #666; }
        .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; padding: 10px; background: #f8f9fa; border-radius: 8px; }
        .info-item { font-size: 13px; } .info-label { font-weight: bold; color: #444; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #1e3a8a; color: white; padding: 8px; text-align: left; font-size: 13px; }
        td { padding: 7px 8px; border-bottom: 1px solid #eee; font-size: 13px; }
        tr:nth-child(even) { background: #f8f9fa; }
        .summary { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .summary-card { text-align: center; padding: 10px; border: 2px solid #1e3a8a; border-radius: 8px; }
        .summary-val { font-size: 24px; font-weight: bold; color: #1e3a8a; }
        .footer { border-top: 2px solid #1e3a8a; padding-top: 15px; display: flex; justify-content: space-between; font-size: 12px; }
        .signature { border-top: 1px solid #000; width: 150px; text-align: center; padding-top: 5px; }
        .sl-flag { color: #1B5E20; font-weight: bold; }
        @media print { body { padding: 10px; } }
      </style></head><body>
      <div class="header">
        <div class="school-name">Bo Government Secondary School</div>
        <div class="subtitle">Sierra Leone · Bo District · Tel: +232 76 000001</div>
        <div style="font-size:15px;font-weight:bold;margin-top:8px;color:#333;">STUDENT REPORT CARD</div>
        <div class="subtitle">${reportCard.term} TERM · Academic Year ${reportCard.year}</div>
      </div>
      <div class="student-info">
        <div class="info-item"><span class="info-label">Student Name:</span> ${reportCard.studentName}</div>
        <div class="info-item"><span class="info-label">Admission No:</span> ${reportCard.admissionNo}</div>
        <div class="info-item"><span class="info-label">Class:</span> ${reportCard.class}</div>
        <div class="info-item"><span class="info-label">Term:</span> ${reportCard.term}</div>
      </div>
      <table>
        <thead><tr><th>#</th><th>Subject</th><th>Score (%)</th><th>Grade</th><th>Remark</th></tr></thead>
        <tbody>
          ${subjects.map((subject, i) => {
            const score = Number(scores[subject]);
            const { grade, remark } = getGrade(score);
            return `<tr><td>${i+1}</td><td>${subject}</td><td>${score}</td><td><strong>${grade}</strong></td><td>${remark}</td></tr>`;
          }).join('')}
        </tbody>
      </table>
      <div class="summary">
        <div class="summary-card"><div class="summary-val">${total}</div><div>Total Score</div></div>
        <div class="summary-card"><div class="summary-val">${avg}%</div><div>Average</div></div>
        <div class="summary-card"><div class="summary-val" style="color:${Number(avg)>=40?'#166534':'#991b1b'}">${grade}</div><div>Overall Grade</div></div>
      </div>
      <div class="footer">
        <div><div class="signature">Class Teacher</div></div>
        <div style="text-align:center;font-size:11px;color:#666;">
          <div class="sl-flag">🇸🇱 Republic of Sierra Leone</div>
          <div>Ministry of Basic & Senior Secondary Education</div>
          <div style="margin-top:5px;font-size:10px;">Generated by EduManage SL · Designed by Musa Mansaray</div>
        </div>
        <div><div class="signature">Principal</div></div>
      </div>
      </body></html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exams & Report Cards</h1>
        <p className="text-gray-500 text-sm mt-1">NPSE · BECE · WASSCE · Internal exams</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {['exams', 'report-card'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t === 'exams' ? 'Exam Management' : 'Generate Report Card'}
          </button>
        ))}
      </div>

      {tab === 'exams' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Exam
            </button>
          </div>

          {exams.length === 0 ? (
            <div className="card text-center py-16">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">No exams created yet</p>
            </div>
          ) : exams.map(exam => (
            <div key={exam.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                    <p className="text-sm text-gray-500">{exam.class?.name} · {exam.term} Term · {exam.academicYear?.year}</p>
                    <p className="text-xs text-gray-400">{new Date(exam.startDate).toLocaleDateString()} — {new Date(exam.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="badge-blue">{exam._count?.results || 0} results</span>
              </div>
            </div>
          ))}

          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg p-6">
                <h2 className="text-lg font-semibold mb-5">Create Exam</h2>
                <form onSubmit={handleCreateExam} className="space-y-4">
                  <div><label className="label">Exam Name</label><input className="input" required placeholder="e.g. Second Term Examination 2026" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Term</label>
                      <select className="input" value={form.term} onChange={e => setForm({...form, term: e.target.value})}>
                        <option value="FIRST">First Term</option>
                        <option value="SECOND">Second Term</option>
                        <option value="THIRD">Third Term</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Class</label>
                      <select className="input" value={form.classId} onChange={e => setForm({...form, classId: e.target.value})}>
                        <option value="">Select class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="label">Start Date</label><input type="date" className="input" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} /></div>
                    <div><label className="label">End Date</label><input type="date" className="input" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} /></div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                    <button type="submit" className="btn-primary flex-1">Create Exam</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'report-card' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Student Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Student Full Name</label><input className="input" placeholder="e.g. Mohamed Koroma" value={reportCard.studentName} onChange={e => setReportCard({...reportCard, studentName: e.target.value})} /></div>
              <div><label className="label">Admission Number</label><input className="input" placeholder="e.g. SL260001" value={reportCard.admissionNo} onChange={e => setReportCard({...reportCard, admissionNo: e.target.value})} /></div>
              <div><label className="label">Class</label><input className="input" placeholder="e.g. JSS 2A" value={reportCard.class} onChange={e => setReportCard({...reportCard, class: e.target.value})} /></div>
              <div>
                <label className="label">Term</label>
                <select className="input" value={reportCard.term} onChange={e => setReportCard({...reportCard, term: e.target.value})}>
                  <option value="FIRST">First Term</option>
                  <option value="SECOND">Second Term</option>
                  <option value="THIRD">Third Term</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Subject Scores (0–100)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUBJECTS_SL.map(subject => {
                const score = reportCard.scores[subject] || '';
                const { grade, color } = score !== '' ? getGrade(Number(score)) : { grade: '', color: '' };
                return (
                  <div key={subject} className="flex items-center gap-3">
                    <label className="text-sm text-gray-600 w-48 flex-shrink-0">{subject}</label>
                    <input
                      type="number" min="0" max="100"
                      className="input w-24 text-center"
                      placeholder="—"
                      value={score}
                      onChange={e => setReportCard({...reportCard, scores: {...reportCard.scores, [subject]: e.target.value}})}
                    />
                    {grade && <span className={`text-sm font-bold ${color} w-8`}>{grade}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="card flex-1 mr-4">
              <div className="flex items-center gap-4">
                <Award className="w-8 h-8 text-primary-600" />
                <div>
                  {(() => {
                    const scores = Object.values(reportCard.scores).filter(s => s !== '').map(Number);
                    const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
                    const { grade, remark, color } = getGrade(Number(avg));
                    return (
                      <>
                        <p className="text-sm text-gray-500">{scores.length} subjects · Average</p>
                        <p className={`text-2xl font-bold ${color}`}>{avg}% — {grade} ({remark})</p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
            <button onClick={printReportCard} className="btn-primary flex items-center gap-2 px-6 py-3">
              <Download className="w-4 h-4" /> Print Report Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
}