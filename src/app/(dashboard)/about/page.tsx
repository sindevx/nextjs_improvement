import React from 'react';
import { Code, Github, Linkedin, Mail, Terminal, BookOpen } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Sinkerd</h1>
            <p className="mt-4 text-xl text-gray-600">
              Software Developer & Problem Solver
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* About Me Section */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-center mb-6">
            <Terminal className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            Hello! I'm Sinkerd, a passionate programmer with a deep interest in building scalable and efficient solutions. 
            I specialize in creating robust applications that solve real-world problems.
          </p>
          <p className="text-gray-600 leading-relaxed">
            My journey in programming has equipped me with strong problem-solving skills and 
            a keen eye for detail. I believe in writing clean, maintainable code and staying 
            up-to-date with the latest technology trends.
          </p>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex items-center mb-6">
            <Code className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Technical Skills</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded p-4 text-center">
              <span className="font-medium">Frontend</span>
              <p className="text-sm text-gray-600">React, Next.js, Tailwind</p>
            </div>
            <div className="bg-gray-50 rounded p-4 text-center">
              <span className="font-medium">Backend</span>
              <p className="text-sm text-gray-600">Node.js, Express, APIs</p>
            </div>
            <div className="bg-gray-50 rounded p-4 text-center">
              <span className="font-medium">Database</span>
              <p className="text-sm text-gray-600">MongoDB, PostgreSQL</p>
            </div>
            <div className="bg-gray-50 rounded p-4 text-center">
              <span className="font-medium">Tools</span>
              <p className="text-sm text-gray-600">Git, Docker, VS Code</p>
            </div>
            <div className="bg-gray-50 rounded p-4 text-center">
              <span className="font-medium">Languages</span>
              <p className="text-sm text-gray-600">JavaScript, TypeScript, Python</p>
            </div>
            <div className="bg-gray-50 rounded p-4 text-center">
              <span className="font-medium">Cloud</span>
              <p className="text-sm text-gray-600">AWS, Vercel, Netlify</p>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center mb-6">
            <BookOpen className="h-6 w-6 text-purple-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Projects</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Project One</h3>
              <p className="text-gray-600">A full-stack web application built with React and Node.js</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Project Two</h3>
              <p className="text-gray-600">Mobile-first responsive design using Next.js and Tailwind CSS</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Project Three</h3>
              <p className="text-gray-600">API development and integration with third-party services</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 text-center">
          <div className="flex justify-center space-x-6">
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a 
              href="mailto:your-email@example.com" 
              className="text-gray-600 hover:text-red-500 transition-colors duration-300"
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;