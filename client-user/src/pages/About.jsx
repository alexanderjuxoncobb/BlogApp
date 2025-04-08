function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          About Our Blog
        </h1>
        <div className="h-1 w-20 bg-primary-600 mx-auto"></div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-700 mb-4">
          Welcome to our blog platform! Our mission is to create a space where
          people can share ideas, knowledge, and experiences. We believe in the
          power of community and open dialogue.
        </p>
        <p className="text-gray-700">
          This platform was built with modern technologies to provide a seamless
          and enjoyable experience for both readers and content creators.
        </p>
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-primary-600 mr-2 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>User authentication and profile management</span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-primary-600 mr-2 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Create, edit, and delete blog posts</span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-primary-600 mr-2 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Comment system for engaging with posts</span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-primary-600 mr-2 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Responsive design for all devices</span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-primary-600 mr-2 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Admin dashboard for content moderation</span>
          </li>
        </ul>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Technologies Used
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="font-medium text-gray-900">Frontend</div>
            <ul className="mt-2 text-sm text-gray-600">
              <li>React</li>
              <li>React Router</li>
              <li>Tailwind CSS</li>
              <li>Vite</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="font-medium text-gray-900">Backend</div>
            <ul className="mt-2 text-sm text-gray-600">
              <li>Node.js</li>
              <li>Express</li>
              <li>PostgreSQL</li>
              <li>Prisma ORM</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="font-medium text-gray-900">Authentication</div>
            <ul className="mt-2 text-sm text-gray-600">
              <li>JWT</li>
              <li>Passport.js</li>
              <li>bcrypt</li>
              <li>HTTP-only cookies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; // Proper export statement
