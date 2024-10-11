import React,{useContext, useEffect} from 'react'
import NoteContext from '../context/notes/noteContext';
export const About = () => {
  
  
  return (
    <div
      className="w-full mb-10 flex justify-center shadow-lg"
      style={{
        backgroundImage:
          "url('https://www.science.org/do/10.1126/science.caredit.a1600134/full/cc_writing_16x9-1667922204827.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "rgb(31 41 55)",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.875)",
        }}
        className="w-4/5 flex flex-col gap-10 px-20 py-10"
      >
        <h2 className="text-5xl font-serif font-bold ">About Us</h2>
        <hr class="border-4"></hr>
        <div>
          <h3 className="text-3xl font-serif font-medium underline ">
            About NoteSphere
          </h3>
          <p className="text-lg mt-4 pl-2 ">
            NoteSphere is a feedback collection platform designed to let users
            submit and manage feedback in the form of notes. It provides an
            intuitive, user-friendly interface for creating, editing, and
            managing feedback about projects or activities, making it an ideal
            tool for gathering valuable insights. Built with React, Node.js, and
            MongoDB, the application is responsive and dynamic, offering a
            smooth user experience with modern styling powered by Bootstrap.
          </p>
        </div>
        <div>
          <h4 className="text-2xl font-serif font-medium underline">
            Our Goal
          </h4>
          <p className="text-lg mt-4 pl-2 ">
            At NoteSphere, we aim to provide an effortless and efficient way for
            users to collect and manage feedback. By allowing users to submit
            insights in the form of notes, we strive to enhance collaboration
            and drive continuous improvement in projects and activities.
          </p>
        </div>
        <div>
          <h4 className="text-2xl font-serif font-medium underline">
            Features
          </h4>
          <p className="mt-3 pl-2">
            <ul>
              <li className="mt-3 pl-2">
                <strong>Submit Feedback as Notes</strong> Quickly create and
                share feedback in a simple note format.
              </li>
              <li className="mt-3 pl-2">
                <strong>Edit Feedback</strong> Easily modify your notes whenever
                needed.{" "}
              </li>
              <li className="mt-3 pl-2">
                <strong>Delete Feedback</strong> Remove any outdated or
                unnecessary feedback effortlessly.
              </li>
              <li className="mt-3 pl-2">
                <strong>Responsive UI</strong> Enjoy a modern and adaptable
                design that works seamlessly on all devices.
              </li>
              <li className="mt-3 pl-2">
                <strong>User Authentication</strong> Securely log in and
                register using JWT for peace of mind.
              </li>
            </ul>
          </p>
        </div>
        <hr class="border-2"></hr>
        <div>
          <h4 className="text-xl font-serif font-medium underline">License</h4>
          <p className="text-sm mt-3 pl-2">
            This project is licensed under the MIT License. See the 
            <a
              href="https://github.com/ContriHUB/NoteSphere?files=1"
              className="font-bold hover:underline"
            > LICENSE </a>
            file for more details.
          </p>
        </div>
        <hr class="border-2"></hr>
      </div>
    </div>
  );
}
