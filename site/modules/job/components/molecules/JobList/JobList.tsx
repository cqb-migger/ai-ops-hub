import JobShortDescription from './JobShortDescription';

interface Props {
  jobs: Array<Number>;
}
function JobList({ jobs }: Props) {
  return (
    <div className="border rounded-md">
      <div className="p-3">
        +3999{' '}
        <span className="text-primary-900 dark:text-primary-400">jobs</span>
      </div>
      {jobs.map((job: any) => (
        <JobShortDescription key={job} item={job} />
      ))}
    </div>
  );
}
export default JobList;
