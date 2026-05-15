import Navbar from "@/src/components/layout/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex-grow overflow-x-hidden">
        {children}
      </div>
    </>
  );
}
