interface GatePassHeaderProps {
  title: string;
  subtitle: string;
}
 
const GatePassHeader: React.FC<GatePassHeaderProps> = ({ title, subtitle }) => (
  // <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 shadow">
  <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 shadow rounded-t-md">
 
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="text-sm opacity-90">{subtitle}</p>
    </div>
  </header>
);
 
export default GatePassHeader;
 