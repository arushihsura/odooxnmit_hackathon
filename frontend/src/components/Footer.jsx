import { Link } from "react-router-dom";
import logonew from "../assets/logonew.png";

export function Footer() {
  return (
    <footer className="border-t" style={{ backgroundColor: '#5e936c' }}> 
      {/* EcoFinds Green (#2E7D32 is a strong eco-friendly green) */}
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex justify-center md:justify-start">
          <Link to="/" className="flex items-center space-x-2">
  <div className="w-10 md:w-15">
    <img 
      src={logonew} 
      alt="EcoFinds Logo" 
      className="w-full h-auto"
    />
  </div>
  <span className="text-white font-bold text-lg md:text-xl">
    EcoFunds
  </span>
</Link>

          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-end gap-y-3 gap-x-8">
            <a href="/help" className="text-sm text-white hover:text-white/80 transition-colors text-center sm:text-left">
              Help & Support
            </a>
            <a href="/careers" className="text-sm text-white hover:text-white/80 transition-colors text-center sm:text-left">
              Careers
            </a>
            <a href="/terms" className="text-sm text-white hover:text-white/80 transition-colors text-center sm:text-left">
              Terms of Service
            </a>
            <a href="/privacy" className="text-sm text-white hover:text-white/80 transition-colors text-center sm:text-left">
              Privacy Policy
            </a>
            <a href="/shipping" className="text-sm text-white hover:text-white/80 transition-colors text-center sm:text-left">
              Delivery & Refund
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/20 text-center text-sm text-white">
          <p>&copy; {new Date().getFullYear()} EcoFinds. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
