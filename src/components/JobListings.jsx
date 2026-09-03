import { React, useState, useEffect } from "react";
import JobListing from "./JobListing";
import Spinner from "./Spinner";
import { supabase } from "../supabaseClient";

const JobListings = ({ isHome = false, jobs: passedJobs = null }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If jobs are passed as props (from JobsPage), use them
    if (passedJobs) {
      const limitedData = isHome ? passedJobs.slice(0, 3) : passedJobs;
      setJobs(limitedData);
      setLoading(false);
      return;
    }

    // Otherwise fetch from Supabase
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching jobs:", error);
          setJobs([]);
        } else {
          const limitedData = isHome ? data.slice(0, 3) : data;
          setJobs(limitedData || []);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [passedJobs, isHome, setJobs]);

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          {isHome ? "Recent Jobs" : "Browse Jobs"}
        </h2>
        {loading ? (
          <Spinner loading={loading} />
        ) : jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobListing key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>No jobs available at this moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobListings;
