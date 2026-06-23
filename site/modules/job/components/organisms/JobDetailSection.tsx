import { Clock, DollarCircle, Global, LocationTick } from '@public/assets/svg';

export default function JobDetailSection() {
  return (
    <div className="p-4 border rounded-md">
      <div className="text-[24px] dark:text-light">
        Intern/Junior Frontend Developer (Remote Frontend Development
        Internship)
      </div>
      <div className="dark:text-gray-200 text-gray-700 text-[16px]">
        <span>CD Group</span>{' '}
        <span className="dot">Hanoi Capital Region (On-site)</span>
        <div className="flex mt-4">
          <Global />
          <span className="ml-2">Vietnam</span>
        </div>
        <div className="flex mt-4">
          <DollarCircle stroke={'red'} />
          <span className="ml-2">800 - 1,200 USD</span>
        </div>
        <div className="flex mt-4">
          <Clock />
          <span className="ml-2">Fulltime</span>
        </div>
        <div className="flex mt-4">
          <LocationTick />
          <span className="ml-2">2464 Royal Ln. Mesa, New Jersey 45463</span>
        </div>
        <button className="dark:text-light dark:bg-midnight-800 bg-primary-50 px-4 py-2 mt-5 rounded-2xl">
          Applied by Zik profile
        </button>
        <div className="mt-3 dark:text-light">
          <div className="text-[18px] font-medium">About Agoda</div>
          <div className="mt-2">
            Agoda is an online travel booking platform for accommodations,
            flights, and more. We build and deploy cutting-edge technology that
            connects travelers with more than 2.5 million accommodations
            globally. Based in Asia and part of Booking Holdings, our 4,000+
            employees representing 90+ nationalities foster a work environment
            rich in diversity, creativity, and collaboration. We innovate
            through a culture of experimentation and ownership, enhancing the
            ability for our customers to experience the world.
          </div>
          <div className="text-[18px] font-medium">Get to Know our Team:</div>
          <div className="mt-2">
            The Performance Marketing Team of Agoda is a world leader in online
            marketing. This department is highly data-driven and focused on
            developing at-scale marketing programs that improve the lifetime
            value of Agoda customers through measurable marketing programs and
            channels. The team is a blend of the best analysts, marketing
            strategists, and data scientists in the world. The marketing
            leadership at Agoda have deep experience in data science, product,
            strategy, and other marketing fields and have built an organization
            that thrives on data, creative ideas, and technology. The
            Performance Marketing Team also fosters a great learning
            environment. You will be able to learn and grow by working closely
            with experts from a variety of backgrounds from all over the world.
          </div>
        </div>
      </div>
    </div>
  );
}
