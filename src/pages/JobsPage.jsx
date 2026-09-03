import React, { useEffect, useState } from 'react';
import JobListings from '../components/JobListings';
import { supabase } from '../supabaseClient';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching jobs:", error);
          setError(error.message);
          return;
        }

        setJobs(data || []);
      } catch (error) {
        console.error("Failed to fetch jobs:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold">Error loading jobs</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return <JobListings jobs={jobs} />;
};

export default JobsPage;
