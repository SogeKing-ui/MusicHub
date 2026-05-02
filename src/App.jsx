import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import EditPost from "./pages/EditPost.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/post/:id/edit" element={<EditPost />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
