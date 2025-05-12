import React from "react";
import FeatureCard from "./FeatureCard";

const Features = () => {
  const featureList = [
    {
      icon: "./teacher.png",
      title: "Teacher management",
      description:
        "Cloud-based school management solution to help institutions record, track, and monitor students’ enrolment, grade, and attendance records.",
        link: "/login"
    },
    {
      icon: "./student.png",
      title: "Student Management",
      description:
        "Cloud-based online system which enables faculty members to track class-specific attendance and grade records.",
      link: "/login"
    },
    {
      icon: "./money.png",
      title: "Fee Management",
      description:
        "Technology leverages teaching-learning solutions through smart classroom infrastructure.",
      link: "/login"
    },
    {
      icon: "./notifications.png",
      title: "Notices management",
      description:
        "A cloud-based scalable LMS platform for educational institutions of all sizes. It allows teachers to customize courses.",
        link: "/login"
    },
    {
      icon: "./check.png",
      title: "Attendence Management",
      description:
        "Our solutions integrate with a school's existing Student Information System and other teaching platforms.",
        link: "/login"
    },
    {
      icon: "./assignment.png",
      title: "Assignment Management",
      description:
        "We develop mobile learning solutions and content for web and specialized apps.",
        link: "/login"
    },
  ];

  return (
    <div className="py-16 px-6 bg-gray-50">
      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-4xl font-bold text-gray-900">Key Features</p>
        <p className="w-3/5 mx-auto text-lg text-gray-700 mt-2 leading-relaxed">
          Explore our advanced educational solutions designed for better
          management and learning.
        </p>
      </div>

      {/* Feature Cards using Flexbox */}
      <div className="flex flex-wrap justify-center gap-10 ">
        {featureList.map((item, idx) => (
          <FeatureCard
            key={idx}
            icon={item.icon}
            title={item.title}
            description={item.description}
            link = {item.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Features;
