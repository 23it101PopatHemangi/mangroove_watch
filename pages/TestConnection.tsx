import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { authAPI, reportsAPI, alertsAPI } from "@/services/api";

const TestConnection = () => {
  const [healthStatus, setHealthStatus] = useState<string>("");
  const [reportsCount, setReportsCount] = useState<number>(0);
  const [alertsCount, setAlertsCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testBackendConnection = async () => {
    setLoading(true);
    try {
      // Test health endpoint
      const healthResponse = await fetch('http://localhost:5000/health');
      const healthData = await healthResponse.json();
      setHealthStatus(healthData.success ? "✅ Connected" : "❌ Failed");

      // Test reports endpoint
      const reportsResponse = await reportsAPI.getAll();
      setReportsCount(reportsResponse.data.length);

      // Test alerts endpoint
      const alertsResponse = await alertsAPI.getAll();
      setAlertsCount(alertsResponse.data.length);

      toast({
        title: "Connection Test Successful! 🎉",
        description: "Backend is connected and working properly",
      });
    } catch (error: any) {
      setHealthStatus("❌ Failed");
      toast({
        title: "Connection Test Failed",
        description: error.message || "Could not connect to backend",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testUserRegistration = async () => {
    try {
      const testUser = {
        username: `testuser${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        password: "testpass123",
        firstName: "Test",
        lastName: "User"
      };

      const response = await authAPI.register(testUser);
      toast({
        title: "User Registration Test Successful! 🎉",
        description: `Created user: ${response.data.username}`,
      });
    } catch (error: any) {
      toast({
        title: "User Registration Test Failed",
        description: error.message || "Could not register test user",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    testBackendConnection();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Backend Connection Test</CardTitle>
          <CardDescription>
            Test the connection between frontend and backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Backend Status</div>
              <Badge variant={healthStatus.includes("✅") ? "default" : "destructive"}>
                {healthStatus || "Testing..."}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Reports</div>
              <div className="text-3xl font-bold text-green-600">{reportsCount}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Alerts</div>
              <div className="text-3xl font-bold text-blue-600">{alertsCount}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={testBackendConnection} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Testing..." : "Test Connection"}
            </Button>
            <Button 
              onClick={testUserRegistration}
              variant="outline"
              className="flex-1"
            >
              Test User Registration
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">API Endpoints Tested:</h3>
            <ul className="text-sm space-y-1">
              <li>• GET /health - Backend health check</li>
              <li>• GET /api/reports - Fetch all reports</li>
              <li>• GET /api/alerts - Fetch all alerts</li>
              <li>• POST /api/auth/register - User registration</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestConnection;
