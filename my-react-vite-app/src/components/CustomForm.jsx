import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"; // Corrected import
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import config from "../config.json";
import Swal from 'sweetalert2';
const apiUrl = config.apiUrl;

// Rest of the code remains unchanged

// Reusable NavBar Component
const NavBar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // Clear the token from localStorage or cookies
    localStorage.removeItem("access_token");

    // Redirect to the login page
    navigate("/login");
  };
  return (
    <nav className="h-16 bg-white text-black flex items-center px-8 shadow-md">
    <h1 className="text-lg font-semibold" style={{ color: "gray" }}>
      Client B File Decryption
    </h1>
    <div className="ml-auto flex items-center space-x-5">
      <button className="hover:underline" onClick={handleLogout}>
        Logout
      </button>
    </div>
  </nav>
  );
};

// Form validation schema using Zod
const formSchema = z.object({
  projectname: z.string().nonempty("Please select a project."),
  servername: z.string().nonempty("Please select a server name."),
  filepath: z
  .string()
  .min(2, "Please enter a file path or folder path.")
  .regex(
    /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(\/.+)?$/,
    "File path must start with a valid date in the format YYYY-MM-DD, optionally followed by a folder or file path."
  ),
  serverType: z.string().nonempty("Please select a server type."), // Added serverType validation
});

const CustomForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectname: "",
      servername: "",
      filepath: "",
      serverType: "", // Default value for server type
    },
  });

  const [projects, setProjects] = useState([]); // State to store project list
  const [servers, setServers] = useState([]); // State to store server list

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/projects`); // Use apiUrl from config
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data || []); // Assuming the API returns { projects: [...] }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Fetch servers based on selected project
  
  const fetchServers = async (projectName) => {
    try {
      console.log("Fetching servers for project:", projectName);
      const response = await fetch(
        `${apiUrl}/api/servers?project=${projectName}`
      ); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch servers");
      }
      const data = await response.json();
      setServers(data || []); // Assuming the API returns { servers: [...] }
    } catch (error) {
      console.error("Error fetching servers:", error);
      setServers([]); // Reset servers on error
    }
  };

  async function onSubmit(values) {
    console.log("Form Values:", values);

    try {
      const response = await fetch(`${apiUrl}/api/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      const data = await response.json();
      console.log("Response from server:", data.file_path)
       // Trigger file download
    const fileResponse = await fetch(`${apiUrl}/${data.file_path}`, {
      method: "GET",
    });

    if (!fileResponse.ok) {
      throw new Error("Failed to download the file");
    }

    const blob = await fileResponse.blob();
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = data.file_path.split("/").pop(); // Extract the file name from the path
    document.body.appendChild(a);
    a.click();

    // Clean up
    a.remove();
    window.URL.revokeObjectURL(url);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Form submitted successfully!',
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit the form. Please try again.',
      });
    }
  }

  return (
    <div
  style={{
    backgroundImage: "url('public/images/image.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "90vh",
  }}
  
>
      <NavBar />

      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-8 parent-form">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-7 w-full max-w-lg bg-white p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold text-center mb-6"style={{color:'gray'}}>Client B File Decryption</h2>

            {/* Project Dropdown */}
            <FormField
              control={form.control}
              name="projectname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value); // Update form value
                      fetchServers(value); // Fetch servers for the selected project
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.name} value={project.name}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose a project for your submission.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Server Dropdown */}
            <FormField
              control={form.control}
              name="servername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a server" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {servers.map((server) => (
                        <SelectItem key={server.name} value={server.name}>
                          {server.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the server name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="filepath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Path</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter file path"
                      {...field}
                      className="border-gray-300"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a file path for your submission.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Radio Buttons for Server Type */}
            <FormField
              control={form.control}
              name="serverType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Type</FormLabel>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="bucket"
                        checked={field.value === "bucket"}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                      <span>Bucket</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="sftp"
                        checked={field.value === "sftp"}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                      <span>SFTP</span>
                    </label>
                  </div>
                  <FormDescription>
                    Select the type of server you want to use.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-4"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CustomForm;