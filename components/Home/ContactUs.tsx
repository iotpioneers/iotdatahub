// import React from 'react';

const ContactUs = () => {
  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center text-yellow-600">
        Contact Us
      </h2>
      <p className="text-center text-gray-600">
        Any question or remarks? Just write us a message!
      </p>
      <div className="flex flex-wrap justify-around mt-10">
        <div className="bg-blue-900 text-white p-8 rounded-lg w-full md:w-1/3 mb-6 md:mb-0">
          <h3 className="text-xl font-bold mb-4">Contact Information</h3>
          <p className="mb-6">Say something to start a live chat!</p>
          <p className="mb-2">
            <i className="fas fa-phone"></i> +1012 3456 789
          </p>
          <p className="mb-2">
            <i className="fas fa-envelope"></i> demo@gmail.com
          </p>
          <p className="mb-6">
            <i className="fas fa-map-marker-alt"></i> 132 Dartmouth Street
            Boston, Massachusetts 02156 United States
          </p>
          <div className="flex space-x-4">
            <i className="fab fa-twitter"></i>
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-instagram"></i>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <form className="bg-white p-8 rounded-lg shadow-lg">
            <div className="mb-4">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                className="w-full p-2 border border-gray-300 rounded mt-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="w-full p-2 border border-gray-300 rounded mt-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded mt-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="w-full p-2 border border-gray-300 rounded mt-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Select Subject:</label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="subject"
                    value="General Inquiry"
                    className="form-radio text-yellow-500"
                    defaultChecked
                  />
                  <span className="ml-2">General Inquiry</span>
                </label>
                {/* Add more radio buttons as needed */}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Message</label>
              <textarea
                name="message"
                className="w-full p-2 border border-gray-300 rounded mt-2"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
