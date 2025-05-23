
import Layout from "/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Profile Information</h3>
                <p className="text-gray-500">Manage your account profile settings</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Security</h3>
                <p className="text-gray-500">Update your password and security preferences</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Notifications</h3>
                <p className="text-gray-500">Manage your notification preferences</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;