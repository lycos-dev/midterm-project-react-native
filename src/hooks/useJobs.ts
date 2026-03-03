import { useState, useEffect } from 'react';
import uuid from 'react-native-uuid';
import { Job } from '../types/Job';

const transformJob = (job: any): Job => {
  const title = job.title || job.job_title || job.position || 'No Title';
  const company = job.companyName || job.company || job.company_name || job.employer || 'Unknown Company';

  let salary = 'Negotiable';
  if (job.minSalary && job.maxSalary && job.currency) {
    salary = `${job.currency} ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`;
  } else if (job.minSalary && job.currency) {
    salary = `${job.currency} ${job.minSalary.toLocaleString()}`;
  } else if (job.salary || job.salary_range || job.pay) {
    salary = job.salary || job.salary_range || job.pay;
  }

  let location = 'Location not specified';
  if (job.locations && Array.isArray(job.locations) && job.locations.length > 0) {
    location = job.locations.join(', ');
  } else if (job.location || job.city || job.address) {
    location = job.location || job.city || job.address;
  }

  return {
    id: uuid.v4() as string,
    title,
    company,
    salary,
    location,
    logo: job.companyLogo || job.logo || job.company_logo || job.image || undefined,
  };
};

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://empllo.com/api/v1');
      if (!response.ok) throw new Error('Failed to fetch jobs');

      const data = await response.json();

      let jobsArray: any[] = [];
      if (Array.isArray(data)) jobsArray = data;
      else if (data.jobs && Array.isArray(data.jobs)) jobsArray = data.jobs;
      else if (data.data && Array.isArray(data.data)) jobsArray = data.data;
      else jobsArray = Object.values(data);

      setJobs(jobsArray.map(transformJob));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobs, loading, error, refetch: fetchJobs };
};