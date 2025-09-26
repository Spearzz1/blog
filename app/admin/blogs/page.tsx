"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || user.role !== "admin") router.push("/login");
  }, []);

  useEffect(() => {
    fetch("/api/blogs")
      .then(res => res.json())
      .then(data => setBlogs(data));
  }, []);

  const handleApprove = async (id: string) => {
    await fetch(`/api/blogs/${id}/approve`, { method: "PATCH" });
    setBlogs(prev => prev.map(b => b.id === id ? { ...b, status: "approved" } : b));
  };

  const handleReject = async (id: string) => {
    await fetch(`/api/blogs/${id}/reject`, { method: "PATCH" });
    setBlogs(prev => prev.map(b => b.id === id ? { ...b, status: "rejected" } : b));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Blog Review</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {blogs.map(blog => (
            <tr key={blog.id}>
              <td className="px-4 py-2">{blog.title}</td>
              <td className="px-4 py-2">{blog.author}</td>
              <td className="px-4 py-2">{blog.status}</td>
              <td className="px-4 py-2 flex gap-2">
                <button onClick={() => handleApprove(blog.id)} className="bg-green-500 text-white px-2 py-1 rounded">Approve</button>
                <button onClick={() => handleReject(blog.id)} className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
