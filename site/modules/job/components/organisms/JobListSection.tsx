import JobList from '../molecules/JobList/JobList';

export default function JobListSection() {
  const dataFake: Array<Number> = [0, 1, 2, 3, 4, 5];
  return (
    <section>
      <JobList jobs={dataFake} />
    </section>
  );
}
