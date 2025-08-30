import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, MapPin, Filter, TrendingUp, Activity } from "lucide-react";
import { incidents, getIncidentsByType, getIncidentsByDateRange } from "@/data/mangroveData";

const Alerts = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('month');

  const filteredIncidents = filterType === 'all' 
    ? incidents 
    : getIncidentsByType(filterType as any);

  const sortedIncidents = [...filteredIncidents].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Illegal Cutting": return "bg-red-500 text-white";
      case "Dumping": return "bg-orange-500 text-white";
      case "Erosion": return "bg-yellow-500 text-black";
      default: return "bg-gray-500 text-white";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Illegal Cutting": return "🪓";
      case "Dumping": return "🗑️";
      case "Erosion": return "🌊";
      default: return "⚠️";
    }
  };

  const totalIncidents = incidents.length;
  const illegalCuttingCount = getIncidentsByType('Illegal Cutting').length;
  const dumpingCount = getIncidentsByType('Dumping').length;
  const erosionCount = getIncidentsByType('Erosion').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-eco-mint/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-eco-forest mb-4 flex items-center justify-center space-x-3">
            <AlertTriangle className="h-10 w-10 text-red-500" />
            <span>Environmental Alerts</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time monitoring of mangrove ecosystem threats
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-eco border-eco-sage/20">
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-eco-forest">{totalIncidents}</h3>
              <p className="text-muted-foreground">Total Incidents</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-eco border-eco-sage/20">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-eco-forest">{illegalCuttingCount}</h3>
              <p className="text-muted-foreground">Illegal Cutting</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-eco border-eco-sage/20">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-eco-forest">{dumpingCount}</h3>
              <p className="text-muted-foreground">Dumping</p>
            </CardContent>
          </Card>

          <Card className="shadow-eco border-eco-sage/20">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-eco-forest">{erosionCount}</h3>
              <p className="text-muted-foreground">Erosion</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="Illegal Cutting">Illegal Cutting</option>
              <option value="Dumping">Dumping</option>
              <option value="Erosion">Erosion</option>
            </select>
          </div>

          <div className="flex space-x-2 bg-muted p-1 rounded-lg">
            {(['week', 'month', 'all'] as const).map((filter) => (
              <Button
                key={filter}
                variant={timeFilter === filter ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeFilter(filter)}
                className={timeFilter === filter ? "bg-eco-green hover:bg-eco-green-dark" : ""}
              >
                {filter === 'week' ? 'This Week' : filter === 'month' ? 'This Month' : 'All Time'}
              </Button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {sortedIncidents.slice(0, 20).map((incident) => (
              <Card
                key={incident.id}
                className="transition-all hover:shadow-lg border-red-100 bg-red-50/50"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Type Icon */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                        <span className="text-2xl">{getTypeIcon(incident.type)}</span>
                      </div>
                      
                      {/* Incident Info */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-bold text-lg text-eco-forest">{incident.type}</h3>
                          <Badge className={`${getTypeColor(incident.type)}`}>
                            {incident.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(incident.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{incident.lat.toFixed(4)}, {incident.lng.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Priority */}
                    <div className="text-right">
                      <Badge className="bg-red-500 text-white">High Priority</Badge>
                      <p className="text-xs text-muted-foreground mt-1">Incident #{incident.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="max-w-md mx-auto shadow-eco border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="text-red-800">Report New Threat</CardTitle>
              <CardDescription>
                Help us protect the mangrove ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                Submit Alert Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Alerts;