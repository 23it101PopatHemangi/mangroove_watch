import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Upload, CheckCircle, AlertTriangle } from "lucide-react";
import { incidents, mangroveLocations } from "@/data/mangroveData";
import { useToast } from "@/hooks/use-toast";
import mangroveHero from "@/assets/mangrove-hero.jpg";
import { reportsAPI, alertsAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Report = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nearbyAlerts, setNearbyAlerts] = useState<any[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const checkNearbyAlerts = (lat: number, lng: number) => {
    const nearby = incidents.filter(incident => {
      const distance = Math.sqrt(
        Math.pow(incident.lat - lat, 2) + Math.pow(incident.lng - lng, 2)
      );
      return distance < 0.1; // Within ~10km (increased radius)
    });
    setNearbyAlerts(nearby);
    setShowAlerts(nearby.length > 0);
    
    console.log('Checking alerts for:', lat, lng);
    console.log('Found nearby incidents:', nearby.length);
    
    if (nearby.length > 0) {
      toast({
        title: "⚠️ Nearby Threats Detected!",
        description: `${nearby.length} environmental incidents found near your location.`,
        variant: "destructive",
      });
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(6));
          const lng = parseFloat(position.coords.longitude.toFixed(6));
          
          setLocation({
            lat: lat.toString(),
            lng: lng.toString(),
          });
          
          // Check for nearby alerts
          checkNearbyAlerts(lat, lng);
          
          toast({
            title: "Location captured!",
            description: "Your location has been automatically filled.",
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Could not get your location. Please enter it manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please login first",
        description: "You need to be logged in to submit a report.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!photo || !description || !location.lat || !location.lng) {
      toast({
        title: "Missing information",
        description: "Please fill all fields and upload a photo.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Check for nearby alerts BEFORE submitting
      const lat = parseFloat(location.lat);
      const lng = parseFloat(location.lng);
      const nearby = incidents.filter(incident => {
        const distance = Math.sqrt(
          Math.pow(incident.lat - lat, 2) + Math.pow(incident.lng - lng, 2)
        );
        return distance < 0.1; // Within ~10km (increased radius)
      });
      
      console.log('Submit - Checking alerts for:', lat, lng);
      console.log('Submit - Found nearby incidents:', nearby.length);

      // Create report data
      const reportData = {
        title: `Environmental Threat Report - ${new Date().toLocaleDateString()}`,
        description,
        category: 'other',
        severity: 'medium',
        location: {
          coordinates: {
            lat: lat,
            lng: lng
          }
        },
        tags: ['mangrove', 'environmental-threat']
      };

      // Submit report to backend
      const response = await reportsAPI.create(reportData);
      
      // Show success message
      toast({
        title: "Report submitted! 🎉",
        description: response.message || "You earned +15 points! AI validation in progress. Thank you for protecting our mangroves.",
      });

      // Show nearby alerts if found and save to database
      if (nearby.length > 0) {
        setNearbyAlerts(nearby);
        setShowAlerts(true);
        
        // Save alerts to database
        try {
          const alertResponse = await alertsAPI.createFromIncidents(
            nearby,
            { lat, lng },
            description
          );
          
          console.log('Alerts saved to database:', alertResponse);
          
          toast({
            title: "⚠️ Alerts Saved to Database!",
            description: `${nearby.length} environmental alerts have been created and stored in the database.`,
            variant: "default",
          });
        } catch (alertError) {
          console.error('Error saving alerts to database:', alertError);
          toast({
            title: "⚠️ Nearby Threats Detected!",
            description: `${nearby.length} environmental incidents found near your report location.`,
            variant: "destructive",
          });
        }
      }
      
      // Reset form BUT KEEP ALERTS
      setPhoto(null);
      setPhotoPreview("");
      setDescription("");
      setLocation({ lat: "", lng: "" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Keep alerts visible for 30 seconds then hide
      setTimeout(() => {
        setShowAlerts(false);
        setNearbyAlerts([]);
      }, 30000);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-mint to-background">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={mangroveHero} 
          alt="Mangrove forest landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-eco-forest/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Report a Threat</h1>
            <p className="text-lg md:text-xl text-eco-mint">Help us protect mangrove ecosystems</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-16 relative z-10">
        <Card className="max-w-2xl mx-auto shadow-eco border-eco-sage/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2 text-eco-forest">
              <Camera className="h-6 w-6" />
              <span>Submit Your Report</span>
            </CardTitle>
            <CardDescription>
              Document environmental threats to mangrove forests and earn points for your contribution
            </CardDescription>
            {!user && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  Please <Link to="/login" className="font-medium text-eco-green hover:underline">login</Link> or <Link to="/signup" className="font-medium text-eco-green hover:underline">sign up</Link> to submit reports and earn points!
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label htmlFor="photo" className="text-eco-forest font-medium">
                  Upload Photo *
                </Label>
                <div className="flex flex-col space-y-4">
                  <Input
                    ref={fileInputRef}
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="border-eco-sage focus:ring-eco-green"
                    required
                  />
                  {photoPreview && (
                    <div className="border-2 border-dashed border-eco-sage rounded-lg p-4">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full max-h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-eco-forest font-medium">
                  Describe the Threat *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you observed (e.g., illegal cutting, pollution, construction...)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-24 border-eco-sage focus:ring-eco-green"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-4">
                <Label className="text-eco-forest font-medium">Location *</Label>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <Input
                    placeholder="Latitude"
                    value={location.lat}
                    onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                    className="border-eco-sage focus:ring-eco-green"
                    required
                  />
                  <Input
                    placeholder="Longitude"
                    value={location.lng}
                    onChange={(e) => setLocation({ ...location, lng: e.target.value })}
                    className="border-eco-sage focus:ring-eco-green"
                    required
                  />
                </div>
                <Button
                  type="button"
                  onClick={getLocation}
                  variant="secondary"
                  className="w-full bg-eco-sage hover:bg-eco-sage/80 text-eco-forest"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Use My Current Location
                </Button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-eco-green hover:bg-eco-green-dark text-white font-medium py-3"
              >
                {isSubmitting ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Nearby Alerts Section */}
        {showAlerts && (
          <div className="mt-8">
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Nearby Environmental Threats</span>
                </CardTitle>
                <CardDescription className="text-red-700">
                  {nearbyAlerts.length} incidents detected within 1km of your location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {nearbyAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-red-500 text-white">
                            {alert.type}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {new Date(alert.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          Location: {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-red-600 font-medium">High Priority</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/alerts')}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    View All Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;