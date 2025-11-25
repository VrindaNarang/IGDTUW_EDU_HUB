import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { Users, Upload, Plus } from 'lucide-react';

interface User {
    id: number;
    email: string;
    role: string;
    createdAt: string;
}

interface DashboardProps {
    token: string;
    role: string;
}

export function Dashboard({ token, role }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<'users' | 'upload' | 'addSubject'>(role === 'ADMIN' ? 'users' : 'upload');

    // User Management State
    const [users, setUsers] = useState<User[]>([]);

    // Upload State
    const [branches, setBranches] = useState<any[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [selectedSemester, setSelectedSemester] = useState<any>(null);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<any>(null);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [selectedUnit, setSelectedUnit] = useState('');

    // Add Subject State
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectCode, setNewSubjectCode] = useState('');
    const [addSubjectBranch, setAddSubjectBranch] = useState<any>(null);
    const [addSubjectSemester, setAddSubjectSemester] = useState<any>(null);

    // Fetch users (Admin only)
    useEffect(() => {
        if (role === 'ADMIN') {
            fetchUsers();
        }
    }, [role]);

    // Fetch branches for upload
    useEffect(() => {
        fetch('/api/branches')
            .then(res => res.json())
            .then(data => setBranches(data));
    }, []);

    // Fetch subjects when branch and semester are selected
    useEffect(() => {
        if (selectedBranch && selectedSemester) {
            fetch(`/api/subjects?branchId=${selectedBranch.id}&semesterId=${selectedSemester.id}`)
                .then(res => res.json())
                .then(data => setSubjects(data));
        }
    }, [selectedBranch, selectedSemester]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const promoteUser = async (userId: number, newRole: string) => {
        try {
            await fetch('/api/admin/promote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ userId, role: newRole })
            });
            fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile || !selectedUnit) {
            alert('Please select a file and unit');
            return;
        }

        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('unitId', selectedUnit);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            if (res.ok) {
                alert('File uploaded successfully!');
                setUploadFile(null);
                setSelectedUnit('');
                // Reset form
                setSelectedBranch(null);
                setSelectedSemester(null);
                setSelectedSubject(null);
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubjectName || !newSubjectCode || !addSubjectSemester) {
            alert('Please fill all fields');
            return;
        }

        try {
            const res = await fetch('/api/subjects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newSubjectName,
                    code: newSubjectCode,
                    semesterId: addSubjectSemester.id
                })
            });

            if (res.ok) {
                alert('Subject added successfully!');
                setNewSubjectName('');
                setNewSubjectCode('');
                setAddSubjectBranch(null);
                setAddSubjectSemester(null);
            } else {
                alert('Failed to add subject');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to add subject');
        }
    };

    return (
        <div className="container mx-auto px-4 pt-24 pb-12">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            {/* Tab Navigation */}
            <div className="flex space-x-2 mb-8 border-b border-white/10">
                {role === 'ADMIN' && (
                    <button
                        onClick={() => setActiveTab('users')}
                        className={cn(
                            "px-6 py-3 font-medium transition-all flex items-center space-x-2",
                            activeTab === 'users'
                                ? "text-primary border-b-2 border-primary"
                                : "text-gray-400 hover:text-white"
                        )}
                    >
                        <Users className="w-5 h-5" />
                        <span>User Management</span>
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('upload')}
                    className={cn(
                        "px-6 py-3 font-medium transition-all flex items-center space-x-2",
                        activeTab === 'upload'
                            ? "text-secondary border-b-2 border-secondary"
                            : "text-gray-400 hover:text-white"
                    )}
                >
                    <Upload className="w-5 h-5" />
                    <span>Upload Resources</span>
                </button>
                <button
                    onClick={() => setActiveTab('addSubject')}
                    className={cn(
                        "px-6 py-3 font-medium transition-all flex items-center space-x-2",
                        activeTab === 'addSubject'
                            ? "text-accent border-b-2 border-accent"
                            : "text-gray-400 hover:text-white"
                    )}
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Subject</span>
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'users' && role === 'ADMIN' && (
                <div className="glass rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-t border-white/10">
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">
                                        <span className={cn(
                                            "px-2 py-1 rounded text-xs font-medium",
                                            user.role === 'ADMIN' ? "bg-red-500/20 text-red-300" :
                                                user.role === 'MOD' ? "bg-blue-500/20 text-blue-300" :
                                                    "bg-gray-500/20 text-gray-300"
                                        )}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {user.role === 'USER' && (
                                            <button
                                                onClick={() => promoteUser(user.id, 'MOD')}
                                                className="text-primary hover:underline text-sm"
                                            >
                                                Promote to Mod
                                            </button>
                                        )}
                                        {user.role === 'MOD' && (
                                            <button
                                                onClick={() => promoteUser(user.id, 'USER')}
                                                className="text-red-400 hover:underline text-sm"
                                            >
                                                Demote to User
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'upload' && (
                <div className="max-w-2xl">
                    <h2 className="text-xl font-semibold mb-6">Upload Resource</h2>

                    <form onSubmit={handleUpload} className="space-y-6">
                        {/* Step 1: Select Branch */}
                        <div className="glass p-6 rounded-xl">
                            <label className="block text-sm font-medium text-gray-400 mb-3">Step 1: Select Branch</label>
                            <div className="grid grid-cols-2 gap-3">
                                {branches.map((branch) => (
                                    <button
                                        key={branch.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedBranch(branch);
                                            setSelectedSemester(null);
                                            setSelectedSubject(null);
                                        }}
                                        className={cn(
                                            "p-4 rounded-lg text-left transition-all",
                                            selectedBranch?.id === branch.id
                                                ? "bg-primary text-white"
                                                : "bg-surface/50 hover:bg-surface text-gray-300"
                                        )}
                                    >
                                        <div className="font-medium">{branch.slug.toUpperCase()}</div>
                                        <div className="text-xs opacity-75">{branch.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Select Semester */}
                        {selectedBranch && (
                            <div className="glass p-6 rounded-xl">
                                <label className="block text-sm font-medium text-gray-400 mb-3">Step 2: Select Semester</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {selectedBranch.semesters.map((semester: any) => (
                                        <button
                                            key={semester.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedSemester(semester);
                                                setSelectedSubject(null);
                                            }}
                                            className={cn(
                                                "p-3 rounded-lg text-center transition-all",
                                                selectedSemester?.id === semester.id
                                                    ? "bg-primary text-white"
                                                    : "bg-surface/50 hover:bg-surface text-gray-300"
                                            )}
                                        >
                                            Sem {semester.number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Select Subject */}
                        {selectedSemester && (
                            <div className="glass p-6 rounded-xl">
                                <label className="block text-sm font-medium text-gray-400 mb-3">Step 3: Select Subject</label>
                                <div className="space-y-2">
                                    {subjects.map((subject) => (
                                        <button
                                            key={subject.id}
                                            type="button"
                                            onClick={() => setSelectedSubject(subject)}
                                            className={cn(
                                                "w-full p-4 rounded-lg text-left transition-all",
                                                selectedSubject?.id === subject.id
                                                    ? "bg-primary text-white"
                                                    : "bg-surface/50 hover:bg-surface text-gray-300"
                                            )}
                                        >
                                            <div className="font-medium">{subject.name}</div>
                                            <div className="text-xs opacity-75">{subject.code}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Select Unit and Upload File */}
                        {selectedSubject && (
                            <div className="glass p-6 rounded-xl">
                                <label className="block text-sm font-medium text-gray-400 mb-3">Step 4: Select Unit and Upload File</label>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Unit</label>
                                        <select
                                            value={selectedUnit}
                                            onChange={(e) => setSelectedUnit(e.target.value)}
                                            className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        >
                                            <option value="">Select Unit</option>
                                            {selectedSubject.units.map((unit: any) => (
                                                <option key={unit.id} value={unit.id}>
                                                    Unit {unit.number}: {unit.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">File</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-secondary hover:bg-secondary/90 text-white font-medium py-3 rounded-lg transition-colors"
                                    >
                                        Upload File
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            )}

            {activeTab === 'addSubject' && (
                <div className="max-w-2xl">
                    <h2 className="text-xl font-semibold mb-6">Add New Subject</h2>

                    <form onSubmit={handleAddSubject} className="space-y-6">
                        {/* Step 1: Select Branch */}
                        <div className="glass p-6 rounded-xl">
                            <label className="block text-sm font-medium text-gray-400 mb-3">Step 1: Select Branch</label>
                            <div className="grid grid-cols-2 gap-3">
                                {branches.map((branch) => (
                                    <button
                                        key={branch.id}
                                        type="button"
                                        onClick={() => {
                                            setAddSubjectBranch(branch);
                                            setAddSubjectSemester(null);
                                        }}
                                        className={cn(
                                            "p-4 rounded-lg text-left transition-all",
                                            addSubjectBranch?.id === branch.id
                                                ? "bg-accent text-white"
                                                : "bg-surface/50 hover:bg-surface text-gray-300"
                                        )}
                                    >
                                        <div className="font-medium">{branch.slug.toUpperCase()}</div>
                                        <div className="text-xs opacity-75">{branch.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Select Semester */}
                        {addSubjectBranch && (
                            <div className="glass p-6 rounded-xl">
                                <label className="block text-sm font-medium text-gray-400 mb-3">Step 2: Select Semester</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {addSubjectBranch.semesters.map((semester: any) => (
                                        <button
                                            key={semester.id}
                                            type="button"
                                            onClick={() => setAddSubjectSemester(semester)}
                                            className={cn(
                                                "p-3 rounded-lg text-center transition-all",
                                                addSubjectSemester?.id === semester.id
                                                    ? "bg-accent text-white"
                                                    : "bg-surface/50 hover:bg-surface text-gray-300"
                                            )}
                                        >
                                            Sem {semester.number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Enter Subject Details */}
                        {addSubjectSemester && (
                            <div className="glass p-6 rounded-xl">
                                <label className="block text-sm font-medium text-gray-400 mb-3">Step 3: Enter Subject Details</label>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Subject Name</label>
                                        <input
                                            type="text"
                                            value={newSubjectName}
                                            onChange={(e) => setNewSubjectName(e.target.value)}
                                            placeholder="e.g., Data Structures and Algorithms"
                                            className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Subject Code</label>
                                        <input
                                            type="text"
                                            value={newSubjectCode}
                                            onChange={(e) => setNewSubjectCode(e.target.value)}
                                            placeholder="e.g., CSE-301"
                                            className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 rounded-lg transition-colors"
                                    >
                                        Add Subject
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
}
