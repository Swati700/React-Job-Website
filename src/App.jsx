import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { supabase } from "./supabaseClient";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import NotFoundPage from "./pages/NotFoundPage";
import JobPage, { jobLoader } from "./pages/JobPage";
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";

const App = () => {
  // Add new job to Supabase
  const addJob = async (newJob) => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .insert([newJob])
        .select();

      if (error) {
        console.error("Error adding job:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Failed to add job:", error.message);
      throw error;
    }
  };

  // Delete job from Supabase
  const deleteJob = async (id) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting job:", error);
        throw error;
      }
    } catch (error) {
      console.error("Failed to delete job:", error.message);
      throw error;
    }
  };

  // Update job in Supabase
  const updateJob = async (job) => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .update(job)
        .eq("id", job.id)
        .select();

      if (error) {
        console.error("Error updating job:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Failed to update job:", error.message);
      throw error;
    }
  };

  // Loader to fetch single job from Supabase
  const jobLoaderWithSupabase = async ({ params }) => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching job:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Failed to fetch job:", error.message);
      throw error;
    }
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/add-job" element={<AddJobPage addJobSubmit={addJob} />} />
        <Route
          path="/edit-job/:id"
          element={<EditJobPage updateJobSubmit={updateJob} />}
          loader={jobLoaderWithSupabase}
        />
        <Route
          path="/jobs/:id"
          element={<JobPage deleteJob={deleteJob} />}
          loader={jobLoaderWithSupabase}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
};

export default App;
