const Footer = () => {
  return (
    <footer className="footer text-white py-10 px-4 shadow-t-lg mt-auto w-full relative bottom-0">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-center">
        {/* Contact Us */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold">Contact us</h2>
          <p className="text-white">serv.tupt@gmail.com</p>
          <p className="text-white">+639111111111</p>
          <p className="text-white">Available after availing a service</p>
        </div>
        
        {/* Head Office */}
        <div className="flex flex-col items-center"> 










          
          <h3 className="text-lg font-bold mt-2">Locations</h3>
          <p className="text-white">Km. 14 East Service Road,</p>
          <p className="text-white">South Super Highway, Taguig, Metro Manila.</p>
        </div>

        {/* FAQs */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold">FAQs</h2>
          <p className="text-white"><a href="#" className="hover:underline">Terms and Conditions</a></p>
          <p className="text-white"><a href="#" className="hover:underline">Privacy Policy</a></p>
        </div>
        
        {/* Follow Us */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold">Follow us</h2>
          <p className="text-white"><a href="https://www.facebook.com/tuptaguigofficial" className="hover:underline" target="_blank" rel="noopener noreferrer">Facebook</a></p>
        </div>
      </div>
      <div className="text-center mt-6 text-sm text-white">
        Copyright 2025. SERV. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
