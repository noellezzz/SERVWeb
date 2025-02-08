const Footer = () => {
  return (
    <footer className="footer text-black py-10 px-4 shadow-t-lg mt-auto w-full relative bottom-0">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-center">
        {/* Contact Us */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold">Contact us</h2>
          <p>serv.tupt@gmail.com</p>
          <p>+639111111111</p>
          <p>Available after availing a service</p>
        </div>
        
        {/* Head Office */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold">Head Office</h2>
          <p>TUP-Taguig</p>
          <h3 className="text-lg font-bold mt-2">Locations</h3>
          <p>Km. 14 East Service Road,</p>
          <p>South Super Highway, Taguig, Metro Manila.</p>
        </div>

        {/* FAQs */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold">FAQs</h2>
          <p><a href="#" className="hover:underline">Terms and Conditions</a></p>
          <p><a href="#" className="hover:underline">Privacy Policy</a></p>
        </div>
        
        {/* Follow Us */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold">Follow us</h2>
          <p><a href="https://www.facebook.com/tuptaguigofficial" className="hover:underline" target="_blank" rel="noopener noreferrer">Facebook</a></p>
        </div>
      </div>
      <div className="text-center mt-6 text-sm">
        Copyright 2025. SERV. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;