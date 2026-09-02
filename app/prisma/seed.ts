import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const school = await prisma.school.create({
    data: { name: "Maple Ridge High School", district: "Maple Ridge Unified School District" },
  });

  const passwordHash = await bcrypt.hash("password123", 10);

  // Other real (private, non-public) student accounts at the same school —
  // gives the "School" panel an honest headcount without exposing anyone's
  // profile publicly, matching the private-by-default consent model.
  const otherNames = [
    "Marcus Webb", "Priya Chandra", "Liam Ortiz", "Sofia Reyes", "Ethan Brooks",
    "Nina Patel", "Owen Fischer", "Grace Kim", "Diego Alvarez", "Chloe Bennett",
    "Jamal Carter", "Ruby Anders",
  ];
  for (let i = 0; i < otherNames.length; i++) {
    const name = otherNames[i];
    await prisma.user.create({
      data: {
        email: `student${i + 1}@student.mapleridge.edu`,
        name,
        passwordHash,
        role: "STUDENT",
        schoolId: school.id,
        studentProfile: {
          create: {
            birthdate: new Date("2009-01-01"),
            schoolId: school.id,
            isPublic: false,
          },
        },
      },
    });
  }

  const student = await prisma.user.create({
    data: {
      email: "ava@student.mapleridge.edu",
      name: "Ava Thompson",
      passwordHash,
      role: "STUDENT",
      schoolId: school.id,
      studentProfile: {
        create: {
          headline: "Junior · aspiring mechanical engineer",
          bio: "I split my time between the counter at Riverbend Coffee, weekend shifts at the animal shelter, and building this year's competition robot with Team 4118. Looking to learn more about mechanical engineering programs before I graduate.",
          avatarUrl: "/avatar-ava-v3.png",
          birthdate: new Date("2009-04-12"),
          schoolId: school.id,
          isPublic: true,
        },
      },
    },
    include: { studentProfile: true },
  });

  const mentor = await prisma.user.create({
    data: {
      email: "jordan.reyes@koch.com",
      name: "Jordan Reyes",
      passwordHash,
      role: "MENTOR",
      orgProfile: { create: { orgName: "Koch Industries — Community Engagement", orgType: "mentor" } },
    },
  });

  const company = await prisma.user.create({
    data: {
      email: "manager@riverbendcoffee.com",
      name: "Priya Nair",
      passwordHash,
      role: "COMPANY",
      orgProfile: { create: { orgName: "Riverbend Coffee Roasters", orgType: "company" } },
    },
  });

  const shelter = await prisma.user.create({
    data: {
      email: "volunteers@mapleridgeshelter.org",
      name: "Dana Okafor",
      passwordHash,
      role: "COMPANY",
      orgProfile: { create: { orgName: "Maple Ridge Animal Shelter", orgType: "company" } },
    },
  });

  await prisma.user.create({
    data: {
      email: "admin@mapleridge.edu",
      name: "Dana Whitfield",
      passwordHash,
      role: "SCHOOL_ADMIN",
      schoolId: school.id,
    },
  });

  await prisma.consent.create({
    data: {
      studentId: student.studentProfile!.id,
      parentName: "Maria Thompson",
      parentEmail: "maria.thompson@example.com",
      status: "GRANTED",
      method: "school-recorded",
      grantedAt: new Date(Date.UTC(2026, 0, 15)),
      recordedBy: "Dana Whitfield",
      evidence: "Signed form, 2026-01-15, student file B-114",
    },
  });

  const job = await prisma.experienceEntry.create({
    data: {
      studentId: student.studentProfile!.id,
      type: "JOB",
      title: "Counter Lead",
      org: "Riverbend Coffee Roasters",
      description: "Open and close the counter, train new hires, handle the weekend rush on my own shift.",
      startDate: new Date("2025-07-01"),
    },
  });

  const volunteer = await prisma.experienceEntry.create({
    data: {
      studentId: student.studentProfile!.id,
      type: "VOLUNTEER",
      title: "Volunteer Handler",
      org: "Maple Ridge Animal Shelter",
      description: "Weekend dog-walking and intake support, about 4 hours a week since January.",
      startDate: new Date("2025-01-10"),
    },
  });

  const project = await prisma.experienceEntry.create({
    data: {
      studentId: student.studentProfile!.id,
      type: "PROJECT",
      title: "Lead Builder",
      org: "FRC Robotics Team 4118",
      description: "Designed and built the drivetrain for our competition robot this season.",
      startDate: new Date("2024-09-01"),
    },
  });

  await prisma.endorsement.create({
    data: { entryId: job.id, endorserId: company.id, status: "VERIFIED", note: "Ava has been reliable and great with regulars." },
  });
  await prisma.endorsement.create({
    data: { entryId: volunteer.id, endorserId: shelter.id, status: "VERIFIED", note: "Consistent volunteer, good with the animals." },
  });
  await prisma.endorsement.create({
    data: { entryId: project.id, endorserId: mentor.id, status: "PENDING", requestNote: "I led the drivetrain build this season — you met the team at demo day." },
  });

  console.log("Seeded:", { school: school.name, student: student.email, mentor: mentor.email, company: company.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
