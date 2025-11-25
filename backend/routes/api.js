const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, requireRole, JWT_SECRET } = require('../middleware/auth');

const prisma = new PrismaClient();

// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage });

// --- Auth Routes ---

router.post('/auth/register', async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, username, password: hashedPassword }
        });
        res.json({ message: 'User created', userId: user.id });
    } catch (error) {
        res.status(400).json({ error: 'Email already exists or username taken' });
    }
});

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/auth/me', authenticateToken, async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    res.json({ id: user.id, email: user.email, username: user.username, role: user.role });
});

// --- Admin Routes ---

router.get('/admin/users', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, role: true, createdAt: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/admin/promote', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
    const { userId, role } = req.body; // role should be 'MOD' or 'USER'
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { role }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Public Data Routes ---

router.get('/branches', async (req, res) => {
    try {
        const branches = await prisma.branch.findMany({
            include: { semesters: true }
        });
        res.json(branches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/subjects', async (req, res) => {
    const { branchId, semesterId } = req.query;
    try {
        const subjects = await prisma.subject.findMany({
            where: {
                semester: {
                    branchId: parseInt(branchId),
                    id: parseInt(semesterId)
                }
            },
            include: { units: { include: { files: true } } }
        });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/subjects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const subject = await prisma.subject.findUnique({
            where: { id: parseInt(id) },
            include: {
                units: {
                    include: {
                        files: true
                    }
                }
            }
        });
        res.json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Protected Resource Routes ---

// Admin/Mod: Add a subject
router.post('/subjects', authenticateToken, requireRole(['ADMIN', 'MOD']), async (req, res) => {
    const { name, code, semesterId } = req.body;
    try {
        const subject = await prisma.subject.create({
            data: {
                name,
                code,
                semesterId: parseInt(semesterId)
            }
        });
        // Create 4 units by default
        for (let i = 1; i <= 4; i++) {
            await prisma.unit.create({
                data: {
                    number: i,
                    name: `Unit ${i}`,
                    subjectId: subject.id
                }
            });
        }
        res.json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mod/Admin: Upload resource
router.post('/upload', authenticateToken, requireRole(['ADMIN', 'MOD']), upload.single('file'), async (req, res) => {
    const { unitId, name, type } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Save to Database with local path
        const resource = await prisma.resourceFile.create({
            data: {
                name: name || file.originalname,
                type: type || 'pdf',
                filePath: file.filename, // Saved filename in uploads/
                url: `/uploads/${file.filename}`, // Public URL path
                unitId: parseInt(unitId)
            }
        });

        res.json(resource);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Mod/Admin: Delete resource
router.delete('/resources/:id', authenticateToken, requireRole(['ADMIN', 'MOD']), async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await prisma.resourceFile.findUnique({ where: { id: parseInt(id) } });
        if (!resource) return res.status(404).json({ error: 'Resource not found' });

        // Delete file from filesystem
        const filePath = path.join(__dirname, '../uploads', resource.filePath);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete from database
        await prisma.resourceFile.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mod/Admin: Update resource name
router.put('/resources/:id', authenticateToken, requireRole(['ADMIN', 'MOD']), async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const resource = await prisma.resourceFile.update({
            where: { id: parseInt(id) },
            data: { name }
        });
        res.json(resource);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mod/Admin: Update subject name
router.put('/subjects/:id', authenticateToken, requireRole(['ADMIN', 'MOD']), async (req, res) => {
    const { id } = req.params;
    const { name, code } = req.body;
    try {
        const subject = await prisma.subject.update({
            where: { id: parseInt(id) },
            data: { name, code }
        });
        res.json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mod/Admin: Delete subject
router.delete('/subjects/:id', authenticateToken, requireRole(['ADMIN', 'MOD']), async (req, res) => {
    const { id } = req.params;
    try {
        // Delete all units and their files first
        const subject = await prisma.subject.findUnique({
            where: { id: parseInt(id) },
            include: { units: { include: { files: true } } }
        });

        if (!subject) return res.status(404).json({ error: 'Subject not found' });

        // Delete all files from filesystem
        for (const unit of subject.units) {
            for (const file of unit.files) {
                const filePath = path.join(__dirname, '../uploads', file.filePath);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }

        // Delete subject (cascade will delete units and files from DB)
        await prisma.subject.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
