import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="mx-auto max-w-full  py-8 sm:px-8 md:px-8 lg:px-36 xl:px-36 2xl:px-36">
        <main>{children}</main>
        <footer className="block mt-4 content-center border border-border  justify-center bg-card rounded-lg shadow-card-footer text-center font-normal text-sm text-gray-400 h-[85px]">
          © 2026 tentwenty. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
