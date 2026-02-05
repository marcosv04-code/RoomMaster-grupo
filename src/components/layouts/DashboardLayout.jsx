import Sidebar from '../common/Sidebar'
import Navbar from '../common/Navbar'
import './DashboardLayout.css'

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="layout-content">
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
