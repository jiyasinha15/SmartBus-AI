import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function LiveMap() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-5">

      <h2 className="text-2xl font-bold mb-5">
        Live Bus Tracking
      </h2>

      <MapContainer
        center={[28.4595, 77.0266]}
        zoom={13}
        style={{
          height: "400px",
          borderRadius: "20px",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[28.4595, 77.0266]}>
          <Popup>
            Smart Bus 01
          </Popup>
        </Marker>

      </MapContainer>

    </div>
  );
}