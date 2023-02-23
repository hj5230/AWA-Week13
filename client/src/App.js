import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Routes, useParams } from 'react-router-dom';
import './App.css';

function Index() {
  const [book, setBook] = useState({
    name: "",
    author: "",
    pages: ""
  })

  const handleChange = e => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleClick = async() => {
    const pro = await fetch('/api/book/', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'        
      },
      body: JSON.stringify(book)
    })
    const res = await pro.json()
    console.log(res)
  }

  return (
    <>
    <h1>books</h1>
    <input type="string" id="name" name="name" placeholder="name" value={book.name} onChange={handleChange} /><br />
    <input type="string" id="author" name="author" placeholder="author" value={book.author} onChange={handleChange} /><br />
    <input type="number" id="pages" name="pages" placeholder="pages" value={book.pages} onChange={handleChange} /><br />
    <input type="submit" id="submit" onClick={handleClick} />
    </>
  )
}

function Book() {
  const fetchData = async(bookName) => {
    const pro = await fetch('/api/' + bookName)
    const res = await pro.json()
    console.log(res)
    setBookData(res)
  }
  const params = useParams();
  const [bookData, setBookData] = useState(null)
  useEffect(() => {
    fetchData(params.bookName)
  }, [params.bookName])

  return (
    <>
    <h1>Books</h1>
    {bookData ? (
      bookData.notFound ? (
        <h1>404: This is not the webpage you are looking for</h1>
      ) : (
        <>
        <p>{bookData.name}</p>
        <p>{bookData.author}</p>
        <p>{bookData.pages}</p>
        </>
      )
    ) : (
      <p>loading..</p>
    )}
    </>
  )
}

function App() {


  return (
    <>
    <Router>
      <div>
        <nav>
          <Link to="/">Index</Link>
        </nav>
        <Routes>
        <Route path="/" exact element={<Index />} />
        <Route path="/book/:bookName" element={<Book />} />
        </Routes>
      </div>
    </Router>

    </>
  );
}

export default App;
