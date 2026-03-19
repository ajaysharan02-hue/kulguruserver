require('dotenv').config();
const connectDB = require('../config/database');
const Program = require('../models/Program');
const Banner = require('../models/Banner');
const Inquire = require('../models/Inquire');
const GeneralSetting = require('../models/GeneralSetting');

/**
 * Dummy data seeder for Programs, Banners, Inquiries, and Settings.
 * Run: node src/seed/seedDummyData.js
 *
 * Flow: User visits website → sees Programs (MCA, PhD, MBA, etc.) → can submit Inquiry for a program.
 * Banners are themed around programs/admissions.
 */

const PROGRAMS = [
    {
        name: 'Master of Computer Applications (MCA)',
        code: 'MCA',
        description: 'Post-graduate program in computer applications. Ideal for students who want to build a career in software development, IT consulting, and system design.',
        duration: '2 Years',
        eligibility: 'Graduation in any discipline with Mathematics at 10+2 or graduation level',
        fee: 85000,
        status: 'active',
    },
    {
        name: 'Doctor of Philosophy (PhD)',
        code: 'PHD',
        description: 'Research-oriented doctoral program. Pursue advanced research in your chosen field under expert guidance.',
        duration: '3-5 Years',
        eligibility: 'Post-graduation with minimum 55% (50% for SC/ST) or equivalent',
        fee: 120000,
        status: 'active',
    },
    {
        name: 'Master of Business Administration (MBA)',
        code: 'MBA',
        description: 'Post-graduate program in business administration. Develop leadership and management skills for corporate and entrepreneurial roles.',
        duration: '2 Years',
        eligibility: 'Graduation in any discipline with minimum 50%',
        fee: 95000,
        status: 'active',
    },
    {
        name: 'Bachelor of Computer Applications (BCA)',
        code: 'BCA',
        description: 'Undergraduate program in computer applications. Foundation for IT careers and higher studies like MCA.',
        duration: '3 Years',
        eligibility: '10+2 with Mathematics/Computer Science',
        fee: 45000,
        status: 'active',
    },
    {
        name: 'Bachelor of Business Administration (BBA)',
        code: 'BBA',
        description: 'Undergraduate program in business administration. Prepares students for management roles and MBA.',
        duration: '3 Years',
        eligibility: '10+2 in any stream',
        fee: 42000,
        status: 'active',
    },
    {
        name: 'Master of Science (M.Sc) - Computer Science',
        code: 'MSC-CS',
        description: 'Post-graduate degree in Computer Science with focus on theory and research.',
        duration: '2 Years',
        eligibility: 'B.Sc (Computer Science/IT) or BCA with minimum 50%',
        fee: 55000,
        status: 'active',
    },
];

// Placeholder images (public URLs so banners display without uploads)
const BANNERS = [
    {
        title: 'Admissions Open 2025',
        subtitle: 'MCA, MBA, PhD & more. Apply now and shape your future.',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
        buttonText: 'View Programs',
        buttonLink: '/programs',
        status: 'active',
    },
    {
        title: 'MCA Program – Build Your Tech Career',
        subtitle: '2-year industry-aligned curriculum. Placements with top IT companies.',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
        buttonText: 'Apply for MCA',
        buttonLink: '/programs/mca',
        status: 'active',
    },
    {
        title: 'PhD – Research That Matters',
        subtitle: 'Join our research programs and contribute to knowledge.',
        imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200',
        buttonText: 'Know More',
        buttonLink: '/programs/phd',
        status: 'active',
    },
    {
        title: 'MBA – Lead the Future',
        subtitle: 'Develop leadership skills. Network with industry experts.',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',
        buttonText: 'Apply for MBA',
        buttonLink: '/programs/mba',
        status: 'active',
    },
    {
        title: 'BCA & BBA – Start Your Journey',
        subtitle: 'Undergraduate programs with modern curriculum and placements.',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200',
        buttonText: 'Explore Courses',
        buttonLink: '/programs',
        status: 'active',
    },
];

const INQUIRY_NAMES = [
    'Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Neha Gupta', 'Vikram Patel',
    'Anjali Verma', 'Suresh Reddy', 'Kavita Nair', 'Rajesh Iyer', 'Pooja Mehta',
    'Arun Joshi', 'Divya Krishnan', 'Manish Tiwari', 'Swati Desai', 'Karan Malhotra',
];
const INQUIRY_MOBILES = [
    '9876543210', '9123456789', '9988776655', '9876512345', '9765432109',
    '9654321098', '9543210987', '9432109876', '9321098765', '9210987654',
];

const DEFAULT_SETTINGS = {
    siteName: 'Kulguru',
    tagline: 'Learn. Grow. Lead.',
    contactEmail: 'info@kulguru.com',
    contactPhone: '+91 98765 43210',
    address: 'Education Campus, Knowledge City, India - 110001',
    facebookUrl: 'https://facebook.com/kulguru',
    twitterUrl: 'https://twitter.com/kulguru',
    linkedinUrl: 'https://linkedin.com/company/kulguru',
    admissionYear: '2025',
    footerText: '© 2025 Kulguru. All rights reserved.',
};

async function seedPrograms() {
    const existing = await Program.countDocuments();
    if (existing > 0) {
        console.log('⏭️  Programs already exist, skipping...');
        return await Program.find().select('_id code').lean();
    }
    const inserted = await Program.insertMany(PROGRAMS);
    console.log(`✅ Programs seeded: ${inserted.length}`);
    return inserted.map((p) => ({ _id: p._id, code: p.code }));
}

async function seedBanners() {
    const existing = await Banner.countDocuments();
    if (existing > 0) {
        console.log('⏭️  Banners already exist, skipping...');
        return;
    }
    await Banner.insertMany(BANNERS);
    console.log(`✅ Banners seeded: ${BANNERS.length}`);
}

async function seedInquiries(programIds) {
    const existing = await Inquire.countDocuments();
    if (existing > 0) {
        console.log('⏭️  Inquiries already exist, skipping...');
        return;
    }
    if (!programIds || programIds.length === 0) {
        console.log('⏭️  No programs found, skipping inquiries...');
        return;
    }
    const inquiries = [];
    for (let i = 0; i < 18; i++) {
        const program = programIds[i % programIds.length];
        inquiries.push({
            name: INQUIRY_NAMES[i % INQUIRY_NAMES.length],
            mobile: INQUIRY_MOBILES[i % INQUIRY_MOBILES.length],
            program: program._id,
            status: i % 5 === 0 ? 'inactive' : 'active',
        });
    }
    await Inquire.insertMany(inquiries);
    console.log(`✅ Inquiries seeded: ${inquiries.length}`);
}

async function seedSettings() {
    const existing = await GeneralSetting.findOne();
    if (existing && Object.keys(existing.settings || {}).length > 0) {
        console.log('⏭️  Settings already exist, skipping...');
        return;
    }
    if (existing) {
        existing.settings = { ...DEFAULT_SETTINGS };
        await existing.save();
    } else {
        await GeneralSetting.create({ settings: DEFAULT_SETTINGS });
    }
    console.log('✅ Settings seeded');
}

async function run() {
    try {
        await connectDB();
        console.log('\n🌱 Seeding dummy data...\n');

        const programIds = await seedPrograms();
        await seedBanners();
        await seedInquiries(programIds);
        await seedSettings();

        console.log('\n✅ Dummy data seeding completed.\n');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

run();
