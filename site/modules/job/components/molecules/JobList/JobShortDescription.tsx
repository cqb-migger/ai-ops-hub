import Image from 'next/image';
import heroImg from '@public/assets/images/hero.png';
import { BookMark } from '@public/assets/svg';

function JobShortDescription(item: any) {
  return (
    <div key={item} className="border-t grid grid-cols-4 gap-3 p-2">
      <div className="span-col-1 flex justify-center">
        <figure>
          <Image
            className=""
            src={heroImg}
            alt={'preview image'}
            style={{
              width: '88px',
              height: '88px',
            }}
          />
        </figure>
      </div>

      <div className="col-span-3">
        <div className="grid grid-cols-6">
          <div className="col-span-5">
            Intern/Junior Frontend Developer (Remote Frontend Development
            Internship)
          </div>
          <div className="col-span-1 flex justify-end">
            <BookMark />
          </div>
        </div>
        <div className="col-span-600 dark:text-gray-200 text-gray-600 text-[14px] mt-1">
          CD Group <span className="dot"> Vietnam (On site)</span>
        </div>
        <div className="text-primary-500 mt-2">500$ - 1000$</div>
        <div className="text-[12px] mt-2">
          <span className="text-gray-600 dark:text-gray-200">2 week ago </span>
          <span className="text-green-600 dot"> 12 applicants</span>
        </div>
        <div className="text-[14px] mt-2 text-primary-900 text-right">
          Applied 3 hours ago
        </div>
      </div>
    </div>
  );
}
export default JobShortDescription;
