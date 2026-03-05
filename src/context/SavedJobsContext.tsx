import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Job } from '../types/Job';

interface SavedJobsContextType {
  savedJobs: Job[];
  saveJob: (job: Job) => void;
  unsaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
  appliedJobs: string[];
  markAsApplied: (jobId: string) => void;
  isJobApplied: (jobId: string) => boolean;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

export const SavedJobsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const saveJob = (job: Job) => {
    setSavedJobs((prev) => {
      if (prev.some((j) => j.id === job.id)) return prev;
      return [...prev, job];
    });
  };

  const unsaveJob = (jobId: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const isJobSaved = (jobId: string) => savedJobs.some((j) => j.id === jobId);

  const markAsApplied = (jobId: string) => {
    setAppliedJobs((prev) => {
      if (prev.includes(jobId)) return prev;
      return [...prev, jobId];
    });
  };

  const isJobApplied = (jobId: string) => appliedJobs.includes(jobId);

  return (
    <SavedJobsContext.Provider 
      value={{ 
        savedJobs, 
        saveJob, 
        unsaveJob, 
        isJobSaved,
        appliedJobs,
        markAsApplied,
        isJobApplied,
      }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  return context;
};