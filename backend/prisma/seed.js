const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    // Create Admin and Mod Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            username: 'admin',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });
    console.log('Created Admin:', admin.email);

    const mod = await prisma.user.upsert({
        where: { email: 'mod@example.com' },
        update: {},
        create: {
            email: 'mod@example.com',
            username: 'moderator',
            password: hashedPassword,
            role: 'MOD'
        }
    });
    console.log('Created Mod:', mod.email);

    const branches = [
        { name: 'Computer Science Engineering', slug: 'cse' },
        { name: 'CSE - AI', slug: 'cse-ai' },
        { name: 'AI & ML', slug: 'aiml' },
        { name: 'Mathematics and Computing', slug: 'mac' },
        { name: 'Electronics and Communication', slug: 'ece' },
        { name: 'ECE - AI', slug: 'ece-ai' },
        { name: 'Mechanical Engineering Automation', slug: 'mae' },
    ];

    // Subject templates for each semester
    const semesterSubjects = {
        1: ['Applied Mathematics I', 'Applied Physics I', 'Programming in C', 'Engineering Drawing', 'Communication Skills'],
        2: ['Applied Mathematics II', 'Applied Physics II', 'Data Structures', 'Digital Electronics', 'Environmental Science'],
        3: ['Discrete Mathematics', 'Computer Organization', 'Object Oriented Programming', 'Database Management Systems', 'Operating Systems'],
        4: ['Theory of Computation', 'Computer Networks', 'Software Engineering', 'Microprocessors', 'Design and Analysis of Algorithms'],
        5: ['Machine Learning', 'Compiler Design', 'Web Technologies', 'Computer Graphics', 'Artificial Intelligence'],
        6: ['Cloud Computing', 'Information Security', 'Mobile Application Development', 'Big Data Analytics', 'Internet of Things'],
        7: ['Deep Learning', 'Blockchain Technology', 'Natural Language Processing', 'Cyber Security', 'DevOps'],
        8: ['Project Work', 'Industrial Training', 'Seminar', 'Elective I', 'Elective II']
    };

    for (const b of branches) {
        const branch = await prisma.branch.upsert({
            where: { slug: b.slug },
            update: {},
            create: {
                name: b.name,
                slug: b.slug,
            },
        });

        console.log(`Created branch: ${branch.name}`);

        // Create 8 semesters for each branch
        for (let i = 1; i <= 8; i++) {
            const semester = await prisma.semester.upsert({
                where: {
                    branchId_number: {
                        branchId: branch.id,
                        number: i,
                    },
                },
                update: {},
                create: {
                    number: i,
                    branchId: branch.id,
                },
            });

            // Create subjects for each semester
            const subjects = semesterSubjects[i] || [];
            for (const s of subjects) {
                const existingSubject = await prisma.subject.findFirst({
                    where: {
                        name: s,
                        semesterId: semester.id
                    }
                });

                if (!existingSubject) {
                    const subject = await prisma.subject.create({
                        data: {
                            name: s,
                            code: `${branch.slug.toUpperCase()}-${i}${Math.floor(Math.random() * 100)}`,
                            semesterId: semester.id,
                        },
                    });

                    // Create 4 units
                    for (let u = 1; u <= 4; u++) {
                        await prisma.unit.create({
                            data: {
                                number: u,
                                name: `Unit ${u}`,
                                subjectId: subject.id
                            }
                        })
                    }
                }
            }
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
