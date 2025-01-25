import AdminLayout from "@/components/layout/AdminLayout";

export default function Template({children}: { children: React.ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>;
}