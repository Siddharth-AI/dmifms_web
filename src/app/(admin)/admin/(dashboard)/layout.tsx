import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Toaster } from "react-hot-toast";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden selection:bg-blue-100 selection:text-blue-900 font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1E293B",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            padding: "12px 20px",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-white relative">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth relative">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
