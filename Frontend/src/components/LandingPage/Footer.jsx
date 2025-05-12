import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 shadow-lg py-6 px-4 sm:px-10 md:px-16 lg:px-20">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-800 text-center sm:text-left text-sm sm:text-base font-medium">
        <p>© Edumon. Made with ❤️ by Yaswant</p>
        <div className="flex gap-3 items-center">
          <a href="https://www.linkedin.com/in/yaswant-soni-8b6412282" target="_blank" rel="noopener noreferrer">
            <img
              src="./linkedin.png"
              alt="LinkedIn"
              className="h-6 w-6 rounded-full cursor-pointer hover:scale-110 transition-transform"
            />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <img
              src="./instagram.png"
              alt="Instagram"
              className="h-6 w-6 rounded-full cursor-pointer hover:scale-110 transition-transform"
            />
          </a>
          <a href="https://github.com/Yaswantsoni1128" target="_blank" rel="noopener noreferrer">
            <img
              src="./github.png"
              alt="GitHub"
              className="h-6 w-6 rounded-full cursor-pointer hover:scale-110 transition-transform"
            />
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <img
              src="./facebook.png"
              alt="Facebook"
              className="h-6 w-6 rounded-full cursor-pointer hover:scale-110 transition-transform"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
