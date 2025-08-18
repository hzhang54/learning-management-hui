import NonDashboardNavbar from "@/components/NonDashboardNavbar";
import Landing from "@/app/(nondashboard)/landing/page"; //45.46
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <div className="nondashboard-layout">
      <NonDashboardNavbar />      
      <main className="nondashboard-layout__main">
        <Landing />

      </main>
      <Footer />
    </div>
  );
}
