import React, { useEffect, useState } from 'react';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookmarks = async () => {
      // const res = await fetch('http://localhost:5000/api/bookmarks',
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/bookmarks`, 
        {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setBookmarks(data);
    };

    fetchBookmarks();
  }, [token]);

  const deleteBookmark = async (id) => {
    // await fetch(`http://localhost:5000/api/bookmarks/${id}`, {
      await fetch(`${process.env.REACT_APP_API_URL}/api/bookmarks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    setBookmarks(bookmarks.filter(b => b._id !== id));
  };

  return (
    <div className="container my-4">
      <h2 className="text-center">Your Bookmarks</h2>
      <div className="row">
        {bookmarks.map((b, i) => (
          <div className="col-md-4 mb-3" key={i}>
            <div className="card h-100">
              <img src={b.urlToImage} className="card-img-top" alt="news" />
              <div className="card-body">
                <h5 className="card-title">{b.title}</h5>
                <p className="card-text">{b.description}</p>
                <a href={b.url} target="_blank" rel="noreferrer" className="btn btn-primary ">Read More</a>
                <button onClick={() => deleteBookmark(b._id)} className="btn btn-danger btn-sm mt-15  mx-5">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
