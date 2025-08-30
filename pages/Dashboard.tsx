import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, AlertTriangle, TreePine } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import threatExample from "@/assets/threat-example.jpg";
import { reportsAPI } from "@/services/api";
import { incidents, mangroveLocations, getIncidentsByType } from "@/data/mangroveData";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Report {
  id: string;
  lat: number;
  lng: number;
  description: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  image: string;
  reporter: string;
}

const Dashboard = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [showMangroves, setShowMangroves] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await reportsAPI.getAll();
        const backendReports = response.data.map((report: any) => ({
          id: report._id,
          lat: report.location.coordinates.lat,
          lng: report.location.coordinates.lng,
          description: report.description,
          date: new Date(report.createdAt).toISOString().split('T')[0],
          severity: report.severity,
          image: report.images?.[0]?.url || threatExample,
          reporter: `${report.reporter?.firstName || 'Anonymous'} ${report.reporter?.lastName || ''}`
        }));
        setReports(backendReports);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        // Fallback to mock data if API fails
        setReports([
          {
            id: '1',
            lat: 19.0760,
            lng: 72.8777,
            description: 'Illegal mangrove cutting observed in Mumbai coast',
            date: '2025-01-15',
            severity: 'high',
            image: threatExample,
            reporter: 'Amit Sharma'
          },
          {
            id: '2',
            lat: 15.2993,
            lng: 74.1240,
            description: 'Plastic waste dumping in mangrove area',
            date: '2025-01-14',
            severity: 'medium',
            image: threatExample,
            reporter: 'Priya Patel'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map centered on India's coastline
    map.current = L.map(mapContainer.current).setView([15.0, 75.0], 6);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Custom icon for threat markers
    const threatIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div class="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg></div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Add markers for mangrove locations
    if (showMangroves) {
      mangroveLocations.forEach((location) => {
        const mangroveIcon = L.divIcon({
          className: 'custom-marker',
          html: '<div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H8a.5.5 0 0 1 0-1h1.5V4a.5.5 0 0 1 .5-.5z"/><path d="M10 6a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H8a.5.5 0 0 1 0-1h1.5V6.5A.5.5 0 0 1 10 6z"/></svg></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        L.marker([location.lat, location.lng], { icon: mangroveIcon })
          .addTo(map.current!)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold text-sm text-green-700">Mangrove Location #${location.id}</h3>
              <p class="text-xs text-gray-600">Coordinates: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</p>
            </div>
          `);
      });
    }

    // Add markers for incidents
    if (showIncidents) {
      const filteredIncidents = filterType === 'all' ? incidents : getIncidentsByType(filterType as any);
      
      filteredIncidents.forEach((incident) => {
        const incidentIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div class="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([incident.lat, incident.lng], { icon: incidentIcon })
          .addTo(map.current!)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold text-sm">${incident.type}</h3>
              <p class="text-xs text-gray-600 mt-1">Date: ${new Date(incident.timestamp).toLocaleDateString()}</p>
              <p class="text-xs text-gray-600">Location: ${incident.lat.toFixed(4)}, ${incident.lng.toFixed(4)}</p>
            </div>
          `);

        marker.on('click', () => {
          setSelectedIncident(incident);
        });
      });
    }

    // Add markers for user reports
    reports.forEach((report) => {
      const marker = L.marker([report.lat, report.lng], { icon: threatIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${report.description}</h3>
            <p class="text-xs text-gray-600 mt-1">Reported by: ${report.reporter}</p>
            <p class="text-xs text-gray-600">Date: ${new Date(report.date).toLocaleDateString()}</p>
            <span class="inline-block mt-2 px-2 py-1 text-xs rounded ${
              report.severity === 'high' ? 'bg-red-100 text-red-800' :
              report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }">${report.severity.toUpperCase()}</span>
          </div>
        `);

      marker.on('click', () => {
        setSelectedReport(report);
      });
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500 hover:bg-red-600';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-eco-mint/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-eco-forest mb-4">Threat Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Real-time monitoring of mangrove ecosystem threats
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] shadow-eco border-eco-sage/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-eco-forest">
                  <MapPin className="h-5 w-5" />
                  <span>Mangrove Ecosystem Dashboard</span>
                </CardTitle>
                <CardDescription>
                  Click on markers to view detailed information
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => setShowMangroves(!showMangroves)}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      showMangroves ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                  >
                    <TreePine className="w-3 h-3 inline mr-1" />
                    Mangroves ({mangroveLocations.length})
                  </button>
                  <button
                    onClick={() => setShowIncidents(!showIncidents)}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      showIncidents ? 'bg-red-100 text-red-800 border-red-300' : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    Incidents ({incidents.length})
                  </button>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-2 py-1 text-xs border rounded"
                  >
                    <option value="all">All Types</option>
                    <option value="Illegal Cutting">Illegal Cutting</option>
                    <option value="Dumping">Dumping</option>
                    <option value="Erosion">Erosion</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent className="p-4 h-[500px]">
                <div ref={mapContainer} className="w-full h-full rounded-lg" />
              </CardContent>
            </Card>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            <Card className="shadow-eco border-eco-sage/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-eco-forest">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Recent Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedReport?.id === report.id 
                        ? 'border-eco-green bg-eco-mint/30' 
                        : 'border-eco-sage/20 bg-card hover:border-eco-sage/40'
                    }`}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={`text-white ${getSeverityColor(report.severity)}`}>
                        {report.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(report.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-eco-forest mb-2">
                      {report.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Reported by: {report.reporter}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Location: {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Selected Report Details */}
            {selectedReport && (
              <Card className="shadow-eco border-eco-green/20 bg-eco-mint/10">
                <CardHeader>
                  <CardTitle className="text-eco-forest">User Report Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <img
                    src={selectedReport.image}
                    alt="Threat evidence"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <p className="text-sm text-eco-forest mb-2 font-medium">
                    {selectedReport.description}
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Reporter: {selectedReport.reporter}</p>
                    <p>Date: {new Date(selectedReport.date).toLocaleDateString()}</p>
                    <p>Coordinates: {selectedReport.lat.toFixed(6)}, {selectedReport.lng.toFixed(6)}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected Incident Details */}
            {selectedIncident && (
              <Card className="shadow-eco border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800">Incident Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <Badge className="mb-2 bg-red-500 text-white">
                    {selectedIncident.type}
                  </Badge>
                  <p className="text-sm text-red-800 mb-2 font-medium">
                    {selectedIncident.type} detected at location #{selectedIncident.id}
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Date: {new Date(selectedIncident.timestamp).toLocaleDateString()}</p>
                    <p>Coordinates: {selectedIncident.lat.toFixed(6)}, {selectedIncident.lng.toFixed(6)}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;