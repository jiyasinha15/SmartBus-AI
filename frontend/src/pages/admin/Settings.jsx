import {
    Settings,
    School,
    User,
    Mail,
    Phone,
    Bell,
    Shield,
    Moon,
    Save,
} from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8">

            {/* Header */}

            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-500 rounded-3xl p-8 text-white shadow-xl">

                <h1 className="text-4xl font-bold flex items-center gap-3">

                    <Settings size={40} />

                    Settings

                </h1>

                <p className="mt-3 text-blue-100">

                    Manage your SmartBus system settings.

                </p>

            </div>

            {/* School Information */}

            <div className="bg-white rounded-3xl shadow-xl p-8">

                <h2 className="text-2xl font-bold mb-6">

                    School Information

                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>

                        <label className="font-semibold mb-2 block">

                            School Name

                        </label>

                        <div className="relative">

                            <School className="absolute left-4 top-4 text-gray-400" />

                            <input
                                type="text"
                                defaultValue="ABC Public School"
                                className="w-full border rounded-2xl pl-12 py-4 focus:ring-2 focus:ring-cyan-500 outline-none"
                            />

                        </div>

                    </div>

                    <div>

                        <label className="font-semibold mb-2 block">

                            Admin Name

                        </label>

                        <div className="relative">

                            <User className="absolute left-4 top-4 text-gray-400" />

                            <input
                                type="text"
                                defaultValue="Admin"
                                className="w-full border rounded-2xl pl-12 py-4 focus:ring-2 focus:ring-cyan-500 outline-none"
                            />

                        </div>

                    </div>

                    <div>

                        <label className="font-semibold mb-2 block">

                            Email

                        </label>

                        <div className="relative">

                            <Mail className="absolute left-4 top-4 text-gray-400" />

                            <input
                                type="email"
                                defaultValue="admin@smartbus.com"
                                className="w-full border rounded-2xl pl-12 py-4 focus:ring-2 focus:ring-cyan-500 outline-none"
                            />

                        </div>

                    </div>

                    <div>

                        <label className="font-semibold mb-2 block">

                            Phone

                        </label>

                        <div className="relative">

                            <Phone className="absolute left-4 top-4 text-gray-400" />

                            <input
                                type="text"
                                defaultValue="+91 9876543210"
                                className="w-full border rounded-2xl pl-12 py-4 focus:ring-2 focus:ring-cyan-500 outline-none"
                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* System Settings */}

            <div className="bg-white rounded-3xl shadow-xl p-8">

                <h2 className="text-2xl font-bold mb-6">

                    System Settings

                </h2>

                <div className="space-y-5">

                    <div className="flex justify-between items-center border rounded-2xl p-5">

                        <div className="flex items-center gap-3">

                            <Bell className="text-blue-600" />

                            <span>Notifications</span>

                        </div>

                        <input type="checkbox" defaultChecked />

                    </div>

                    
            
                    <div className="flex justify-between items-center border rounded-2xl p-5">

                        <div className="flex items-center gap-3">

                            <Shield className="text-green-600" />

                            <span>GPS Tracking Enabled</span>

                        </div>

                        <input type="checkbox" defaultChecked />

                    </div>

                    <div className="flex justify-between items-center border rounded-2xl p-5">

                        <div className="flex items-center gap-3">

                            <Shield className="text-red-600" />

                            <span>Two Factor Authentication</span>

                        </div>

                        <input type="checkbox" />

                    </div>

                </div>

            </div>

            {/* Security */}

            <div className="bg-white rounded-3xl shadow-xl p-8">

                <h2 className="text-2xl font-bold mb-6">

                    Security

                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>

                        <label className="font-semibold mb-2 block">

                            New Password

                        </label>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full border rounded-2xl px-4 py-4 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />

                    </div>

                    <div>

                        <label className="font-semibold mb-2 block">

                            Confirm Password

                        </label>

                        <input
                            type="password"
                            placeholder="Confirm password"
                            className="w-full border rounded-2xl px-4 py-4 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />

                    </div>

                </div>

            </div>

            {/* Action Buttons */}

            <div className="flex flex-wrap gap-4">

                <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-2xl hover:scale-105 transition">

                    <Save size={20} />

                    Save Settings

                </button>

                <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl transition">

                    Logout

                </button>

            </div>

        </div>
    );
}