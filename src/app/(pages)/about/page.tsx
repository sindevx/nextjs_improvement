import React from 'react';
import AdminLayout from "@/components/layout/AdminLayout";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode
}

const About: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Welcome to the About Page</h1>
    </div>
  );
};

About.getLayout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;

export default About;