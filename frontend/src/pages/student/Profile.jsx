import {
    User,
    Mail,
    Phone,
    School,
    Bus,
    MapPinned,
    Clock,
    Shield,
    Users,
    Award,
} from "lucide-react";

export default function Profile() {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <div className="space-y-8">

            {/* Header */}

            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-500 rounded-3xl p-8 text-white shadow-xl">

                <h1 className="text-4xl font-bold flex items-center gap-3">
                    <User size={40} />
                    Student Profile
                </h1>

                <p className="mt-3 text-blue-100">
                    View your personal and transport information.
                </p>

            </div>

            {/* Profile Card */}

            <div className="bg-white rounded-3xl shadow-xl p-8">

                <div className="flex flex-col md:flex-row items-center gap-8">

                    <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center border-4 border-cyan-300 shadow-lg">
                        <User size={70} className="text-white" />
                    </div>

                    <div className="flex-1">

                        <h2 className="text-3xl font-bold">
                            {user?.name}
                        </h2>

                        <p className="text-gray-500 mt-2">
                            B.Tech - Computer Science
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mt-6">

                            <div className="flex items-center gap-3">
                                <School className="text-blue-600" />
                                <span>{user?.rollNo}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="text-green-600" />
                                <span>{user?.email}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="text-orange-500" />
                                <span>+91 {user?.phone}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Shield className="text-purple-600" />
                                <span>{user?.semester}</span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Stats */}

            <div className="grid md:grid-cols-4 gap-6">

                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl">
                    <Award size={35} />
                    <p className="mt-4">Attendance</p>
                    <h2 className="text-3xl font-bold mt-2">96%</h2>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 text-white shadow-xl">
                    <Bus size={35} />
                    <p className="mt-4">Trips</p>
                    <h2 className="text-3xl font-bold mt-2">152</h2>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl p-6 text-white shadow-xl">
                    <Clock size={35} />
                    <p className="mt-4">On Time</p>
                    <h2 className="text-3xl font-bold mt-2">148</h2>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-6 text-white shadow-xl">
                    <Users size={35} />
                    <p className="mt-4">Missed</p>
                    <h2 className="text-3xl font-bold mt-2">4</h2>
                </div>

            </div>

            {/* Bus & Guardian */}

            <div className="grid lg:grid-cols-2 gap-6">

                {/* Bus Details */}

                <div className="bg-white rounded-3xl shadow-xl p-8">

                    <h2 className="text-2xl font-bold mb-6">
                        Bus Details
                    </h2>

                    <div className="space-y-5">

                        <div className="flex items-center gap-3">
                            <Bus className="text-blue-600" />
                            <span>Bus Number : BUS-07</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPinned className="text-green-600" />
                            <span>Route : North Campus</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Clock className="text-orange-500" />
                            <span>Pickup : 08:15 AM</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <User className="text-purple-600" />
                            <span>Driver : Rahul Sharma</span>
                        </div>

                    </div>

                </div>

                {/* Guardian */}

                <div className="bg-white rounded-3xl shadow-xl p-8">

                    <h2 className="text-2xl font-bold mb-6">
                        Guardian Details
                    </h2>

                    <div className="space-y-5">

                        <div className="flex items-center gap-3">
                            <Users className="text-blue-600" />
                            <span>Ramesh Kumar</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone className="text-green-600" />
                            <span>+91 9123456789</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPinned className="text-red-500" />
                            <span>Patna, Bihar</span>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}