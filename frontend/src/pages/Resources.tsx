import React, { useState } from 'react';
import { Upload, FileText, Trash2, Edit2, Save, X, Plus, ChevronLeft, Download } from 'lucide-react';
import { PDFViewer } from '../components/PDFViewer';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

interface ResourcesProps {
    token: string;
    role?: string;
}

// --- Resources Tab Component ---
function ResourcesTab({ token, role }: ResourcesProps) {
    const [view, setView] = useState<'branches' | 'semester' | 'subject'>('branches');
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [selectedSemester, setSelectedSemester] = useState(1);
    const [selectedSubject, setSelectedSubject] = useState<any>(null);
    const [branches, setBranches] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [pdfViewerFile, setPdfViewerFile] = useState<{ url: string, name: string } | null>(null);
    const [editingSubject, setEditingSubject] = useState<any>(null);
    const [editSubjectName, setEditSubjectName] = useState('');
    const [editSubjectCode, setEditSubjectCode] = useState('');

    const isAdminOrMod = role === 'ADMIN' || role === 'MOD';

    React.useEffect(() => {
        fetch(`${API_BASE_URL}/api/branches`)
            .then(res => res.json())
            .then(data => setBranches(data));
    }, []);

    React.useEffect(() => {
        if (selectedBranch) {
            fetch(`${API_BASE_URL}/api/subjects?branchId=${selectedBranch.id}&semesterId=${selectedBranch.semesters.find((s: any) => s.number === selectedSemester)?.id}`)
                .then(res => res.json())
                .then(data => setSubjects(data));
        }
    }, [selectedBranch, selectedSemester]);

    const handleDeleteFile = async (fileId: number) => {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/resources/${fileId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                alert('File deleted successfully');
                // Refresh subject data
                if (selectedSubject) {
                    const refreshed = await fetch(`${API_BASE_URL}/api/subjects/${selectedSubject.id}`).then(r => r.json());
                    setSelectedSubject(refreshed);
                }
            }
        } catch (error) {
            console.error(error);
            alert('Failed to delete file');
        }
    };

    const handleEditSubject = async () => {
        if (!editingSubject) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/subjects/${editingSubject.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: editSubjectName, code: editSubjectCode })
            });

            if (res.ok) {
                alert('Subject updated successfully');
                setEditingSubject(null);
                // Refresh subjects
                const refreshed = await fetch(`${API_BASE_URL}/api/subjects?branchId=${selectedBranch.id}&semesterId=${selectedBranch.semesters.find((s: any) => s.number === selectedSemester)?.id}`).then(r => r.json());
                setSubjects(refreshed);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to update subject');
        }
    };

    const handleDeleteSubject = async (subjectId: number) => {
        if (!confirm('Are you sure you want to delete this subject? All units and files will be deleted.')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/subjects/${subjectId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                alert('Subject deleted successfully');
                // Refresh subjects
                const refreshed = await fetch(`${API_BASE_URL}/api/subjects?branchId=${selectedBranch.id}&semesterId=${selectedBranch.semesters.find((s: any) => s.number === selectedSemester)?.id}`).then(r => r.json());
                setSubjects(refreshed);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to delete subject');
        }
    };

    if (view === 'branches') {
        return (
            <div className="container mx-auto px-4 pt-24 pb-12">
                <h2 className="text-3xl font-bold mb-8">Select Your Branch</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.map((branch) => (
                        <button
                            key={branch.id}
                            onClick={() => { setSelectedBranch(branch); setView('semester'); }}
                            className="glass glass-hover p-8 rounded-2xl text-left group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h3 className="text-2xl font-bold mb-2">{branch.name}</h3>
                            <p className="text-gray-400">8 Semesters • {branch.slug.toUpperCase()}</p>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-24 pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
                <button onClick={() => setView('branches')} className="hover:text-white">Home</button>
                <span>/</span>
                <span className="text-white">{selectedBranch.name}</span>
            </div>

            {/* Semester Selector */}
            <div className="flex space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <button
                        key={sem}
                        onClick={() => setSelectedSemester(sem)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                            selectedSemester === sem
                                ? "bg-white text-background"
                                : "bg-surface text-gray-400 hover:bg-surface/80"
                        )}
                    >
                        Semester {sem}
                    </button>
                ))}
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                    <div key={subject.id} className="glass p-6 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start space-x-4 flex-1">
                                <div className="p-3 bg-primary/20 rounded-lg text-primary">
                                    <FolderOpen className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-lg">{subject.name}</h4>
                                    <p className="text-sm text-gray-400">{subject.code}</p>
                                </div>
                            </div>
                            {isAdminOrMod && (
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => {
                                            setEditingSubject(subject);
                                            setEditSubjectName(subject.name);
                                            setEditSubjectCode(subject.code);
                                        }}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Edit Subject"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSubject(subject.id)}
                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                                        title="Delete Subject"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setSelectedSubject(subject)}
                            className="w-full mt-3 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-sm font-medium transition-colors"
                        >
                            View Resources
                        </button>
                    </div>
                ))}
            </div>

            {/* Edit Subject Modal */}
            {editingSubject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass w-full max-w-md p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4">Edit Subject</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Subject Name</label>
                                <input
                                    type="text"
                                    value={editSubjectName}
                                    onChange={(e) => setEditSubjectName(e.target.value)}
                                    className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Subject Code</label>
                                <input
                                    type="text"
                                    value={editSubjectCode}
                                    onChange={(e) => setEditSubjectCode(e.target.value)}
                                    className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleEditSubject}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-lg transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingSubject(null)}
                                    className="flex-1 bg-surface hover:bg-surface/80 text-white font-medium py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Subject Modal */}
            {selectedSubject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">{selectedSubject.name}</h2>
                            <button
                                onClick={() => setSelectedSubject(null)}
                                className="p-2 hover:bg-white/10 rounded-full"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            {selectedSubject.units.map((unit: any) => (
                                <div key={unit.id} className="bg-surface/30 rounded-xl p-4">
                                    <h3 className="font-semibold text-lg mb-3 text-primary">Unit {unit.number}: {unit.name}</h3>
                                    <div className="space-y-2">
                                        {unit.files.map((file: any) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center justify-between p-3 bg-surface/50 rounded-lg hover:bg-surface transition-colors group"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <FileText className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                                    <span>{file.name}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => setPdfViewerFile({ url: file.url, name: file.name })}
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                        title="View PDF"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <a
                                                        href={file.url}
                                                        download
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                        title="Download"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                    {isAdminOrMod && (
                                                        <button
                                                            onClick={() => handleDeleteFile(file.id)}
                                                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {unit.files.length === 0 && (
                                            <p className="text-sm text-gray-500 italic">No files available</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* PDF Viewer */}
            {pdfViewerFile && (
                <PDFViewer
                    fileUrl={pdfViewerFile.url}
                    fileName={pdfViewerFile.name}
                    onClose={() => setPdfViewerFile(null)}
                />
            )}
        </div>
    );
}

// --- Placement Tab Component ---
function PlacementTab() {
    return (
        <div className="container mx-auto px-4 pt-24 text-center">
            <div className="glass p-12 rounded-2xl max-w-2xl mx-auto">
                <Briefcase className="w-16 h-16 text-secondary mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">Placement Resources</h2>
                <p className="text-gray-400 text-lg">
                    Coming soon: Company-wise preparation guides, roadmaps, and interview experiences.
                </p>
            </div>
        </div>
    );
}

// --- Main Resources Component ---
export function Resources() {
    const [activeTab, setActiveTab] = useState<'resources' | 'placement'>('resources');
    const token = localStorage.getItem('token') || '';
    const role = localStorage.getItem('role') || '';

    return (
        <div>
            {/* Tab Navigation */}
            <div className="fixed top-16 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-white/10">
                <div className="container mx-auto px-4">
                    <div className="flex space-x-1 py-2">
                        <button
                            onClick={() => setActiveTab('resources')}
                            className={cn(
                                "px-6 py-3 rounded-lg text-sm font-medium transition-all",
                                activeTab === 'resources'
                                    ? "bg-primary text-white"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            Educational Resources
                        </button>
                        <button
                            onClick={() => setActiveTab('placement')}
                            className={cn(
                                "px-6 py-3 rounded-lg text-sm font-medium transition-all",
                                activeTab === 'placement'
                                    ? "bg-secondary text-white"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            Placement Preparation
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="pt-8">
                {activeTab === 'resources' ? <ResourcesTab token={token} role={role} /> : <PlacementTab />}
            </div>
        </div>
    );
}
