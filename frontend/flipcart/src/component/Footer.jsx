import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">

      <div className="max-w-7xl mx-auto px-5 py-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* About */}
          <div>
            <h2 className="font-bold text-lg mb-4">
              ABOUT
            </h2>

            <ul className="space-y-2 text-gray-400">
              <li>Contact Us</li>
              <li>About Us</li>
              <li>Careers</li>
              <li>Corporate Information</li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h2 className="font-bold text-lg mb-4">
              HELP
            </h2>

            <ul className="space-y-2 text-gray-400">
              <li>Payments</li>
              <li>Shipping</li>
              <li>Cancellation</li>
              <li>Returns</li>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h2 className="font-bold text-lg mb-4">
              POLICY
            </h2>

            <ul className="space-y-2 text-gray-400">
              <li>Return Policy</li>
              <li>Terms Of Use</li>
              <li>Security</li>
              <li>Privacy</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h2 className="font-bold text-lg mb-4">
              SOCIAL
            </h2>

            <ul className="space-y-2 text-gray-400">
              <li>Facebook</li>
              <li>Instagram</li>
              <li>Twitter</li>
              <li>YouTube</li>
            </ul>
          </div>

        </div>

        <hr className="my-8 border-gray-700" />

        <div className="text-center text-gray-400">
          © 2026 FlipShop. All Rights Reserved.
        </div>

      </div>

    </footer>
  );
};

export default Footer;