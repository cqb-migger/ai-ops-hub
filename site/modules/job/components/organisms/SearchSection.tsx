import {
  SearchFilter,
  SearchFilterMobile,
  SearchInput,
} from '../molecules/JobSearch';
export default function SearchSection() {
  const dataItem = [{}];
  return (
    <section className="border-b border-solid pb-4 z-10">
      <div className="container mx-auto pt-2">
        <SearchInput />
        <SearchFilter />
        <SearchFilterMobile />
      </div>
    </section>
  );
}
