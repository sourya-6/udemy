// import { Route, Routes, Navigate } from "react-router-dom";
// import { useContext } from "react";

// import { AuthContext } from "./context/auth-context";
// import RouteGuard from "./components/route-guard";

// import AuthPage from "./pages/auth";
// import InstructorDashboardPage from "./pages/instructor";
// import AddNewCoursePage from "./pages/instructor/add-new-course";

// import StudentViewCommonLayout from "./components/student-view/common-layout";
// import StudentHomePage from "./pages/student/home";
// import StudentViewCoursesPage from "./pages/student/courses";
// import StudentViewCourseDetailsPage from "./pages/student/course-details";
// import PaypalPaymentReturnPage from "./pages/student/payment-return";
// import StudentCoursesPage from "./pages/student/student-courses";
// import StudentViewCourseProgressPage from "./pages/student/course-progress";

// import NotFoundPage from "./pages/not-found";

// function App() {
//   const { auth } = useContext(AuthContext);

//   // Optional: Show loader or null if auth is not ready
//   if (!auth) return null;

//   return (
//     <Routes>
//       {/* Auth Page */}
//       <Route
//         path="/auth"
//         element={
//           <RouteGuard
//             element={<AuthPage />}
//             authenticated={auth?.authenticate}
//             user={auth?.user}
//           />
//         }
//       />

//       {/* Instructor Pages */}
//       <Route
//         path="/instructor"
//         element={
//           <RouteGuard
//             element={<InstructorDashboardPage />}
//             authenticated={auth?.authenticate}
//             user={auth?.user}
//           />
//         }
//       />
//       <Route
//         path="/instructor/create-new-course"
//         element={
//           <RouteGuard
//             element={<AddNewCoursePage />}
//             authenticated={auth?.authenticate}
//             user={auth?.user}
//           />
//         }
//       />
//       <Route
//         path="/instructor/edit-course/:courseId"
//         element={
//           <RouteGuard
//             element={<AddNewCoursePage />}
//             authenticated={auth?.authenticate}
//             user={auth?.user}
//           />
//         }
//       />

//       {/* Student Pages (Common Layout) */}
//       <Route
//         path="/"
//         element={
//           <RouteGuard
//             element={<StudentViewCommonLayout />}
//             authenticated={auth?.authenticate}
//             user={auth?.user}
//           />
//         }
//       >
//         {/* Optional: redirect from / to /home */}
//         <Route index element={<Navigate to="home" />} />
//         <Route path="home" element={<StudentHomePage />} />
//         <Route path="courses" element={<StudentViewCoursesPage />} />
//         <Route
//           path="course/details/:id"
//           element={<StudentViewCourseDetailsPage />}
//         />
//         <Route path="payment-return" element={<PaypalPaymentReturnPage />} />
//         <Route path="student-courses" element={<StudentCoursesPage />} />
//         <Route
//           path="course-progress/:id"
//           element={<StudentViewCourseProgressPage />}
//         />
//       </Route>

//       {/* 404 Page */}
//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   );
// }

// export default App;
import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "./context/auth-context";
import RouteGuard from "./components/route-guard";

import AuthPage from "./pages/auth";
import InstructorDashboardPage from "./pages/instructor";
import AddNewCoursePage from "./pages/instructor/add-new-course";

import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./pages/student/home";
import StudentViewCoursesPage from "./pages/student/courses";
import StudentViewCourseDetailsPage from "./pages/student/course-details";
import PaypalPaymentReturnPage from "./pages/student/payment-return";
import StudentCoursesPage from "./pages/student/student-courses";
import StudentViewCourseProgressPage from "./pages/student/course-progress";

import NotFoundPage from "./pages/not-found";

function App() {
  const { auth, loading } = useContext(AuthContext);

  // Wait until auth is checked
  if (loading) return null;

  return (
    <Routes>
      {/* Auth Page */}
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      {/* Instructor Pages */}
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/create-new-course"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      {/* Student Pages (Common Layout) */}
      <Route
        path="/"
        element={
          <RouteGuard
            element={<StudentViewCommonLayout />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      >
        <Route index element={<Navigate to="home" />} />
        <Route path="home" element={<StudentHomePage />} />
        <Route path="courses" element={<StudentViewCoursesPage />} />
        <Route
          path="course/details/:id"
          element={<StudentViewCourseDetailsPage />}
        />
        <Route path="payment-return" element={<PaypalPaymentReturnPage />} />
        <Route path="student-courses" element={<StudentCoursesPage />} />
        <Route
          path="course-progress/:id"
          element={<StudentViewCourseProgressPage />}
        />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
