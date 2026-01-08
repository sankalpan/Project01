import React, { Component } from 'react'
import PropTypes from "prop-types";

export  class NewsItem extends Component  { 
    
    render () {
        let {title, description, imageUrl,newsUrl,author,date,source} = this.props;
  return (
    <div className='my-3'>
      <div className="card" >
      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{left:'90%',zIndex:'1'}}> {source}
      </span>
      {/* <img src = {imageUrl} className="card-img-top" alt='...'/> */}
      <img
       src={imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
       onError={(e) => {
       e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
       }}
  className="card-img-top"
  alt={title}
/>

     <div className="card-body">
    <h5 className="card-title"> {title} </h5>
    <p className="card-text">{description}</p>
    <p className="card-text"><small className="text-body-secondary">By {!author?"Unknown":author} on { new Date(date).toGMTString()}</small></p>
    <a  href={newsUrl} target='_blank' className="btn btn-sm btn-dark" rel="noreferrer">Read More</a>
  </div>
  </div>
  
   </div>
  )
}
}
NewsItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  newsUrl: PropTypes.string.isRequired,
  author: PropTypes.string,
  date: PropTypes.string
};

export default NewsItem
