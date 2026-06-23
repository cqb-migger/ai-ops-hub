// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import Footer from '@base/components/organisms/Footer';
import Header from '@base/components/organisms/Header';
import PageTemplate from '@base/components/templates/PageTemplate';
import SearchSection from '../../modules/job/components/organisms/SearchSection';
import JobListSection from '../../modules/job/components/organisms/JobListSection';
import JobDetailSection from '../../modules/job/components/organisms/JobDetailSection';

function Jobs() {
  return (
    <PageTemplate header={<Header />} footer={<Footer />}>
      <main>
        <SearchSection />
        <section className="mt-5">
          <div className="container">
            <div className="grid grid-cols-12 gap-3">
              <div className="sm:col-span-4 col-span-12">
                <JobListSection />
              </div>
              <div className="sm:col-span-8 col-span-12 hidden sm:block">
                <JobDetailSection />
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageTemplate>
  );
}

export default Jobs;
