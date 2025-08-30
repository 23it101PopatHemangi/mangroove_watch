import { Heart, Waves } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-eco-forest text-eco-mint border-t border-eco-sage/20 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Waves className="h-5 w-5" />
            <span className="text-sm">Built with</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span className="text-sm">at HackOut'25</span>
          </div>
          
          <div className="text-sm text-center md:text-right">
            <p>© 2025 Mangrove Watch</p>
            <p className="text-xs text-eco-sage">Protecting coastal ecosystems together</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;