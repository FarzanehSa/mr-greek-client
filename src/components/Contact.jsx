import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.scss";

const Contact = ({storeInfo}) => {
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message:"",
  });

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({...formData, [name]: value})
  };

  const reset= () => {
    setFormData({
      user_name: "",
      user_email: "",
     message:""
    })
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .send(
        process.env.REACT_APP_EMAIL_SERVICE_ID,
        process.env.REACT_APP_EMAIL_TEMPLATE_ID,
        formData,
        process.env.REACT_APP_EMAIL_PUBLIC_KEY
      )
      .then(
        (result) => {
          setDone(true);
          reset();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <div className="contact-form">
      <img
        src="../wave.jpg"
        alt="wave"
        className="wave-img"
      />
      <p className="title">
        <span>Contact Us</span>
      </p>
      <p className="title-2">
        <span>General Inquiries and Customer Feedback</span>
      </p>
      <p className="line-text">
        <span>Fill out our from and send us a note!</span>
      </p>

      <div className="container">
        <div className="contact-info">
          <img
            src="../contact.jpeg"
            alt="contact"
            className="contact-img"
          />
          <span className="info-text info-text-title">{storeInfo.storename}</span>
          <span className="info-text">11:00am _ 10:00pm</span>
          <span className="info-text">{storeInfo.address}</span>
          <span className="info-text">{storeInfo.tel}</span>
        </div>

        <div className="c-form">
          <form onSubmit={sendEmail}>
            <input 
              type="text" 
              name="user_name" 
              className="user"  
              placeholder="Name"
              required
              value={formData.user_name}
              onChange={handleChange}
              autoFocus
            />
            <input 
              type="email"
              name="user_email"
              className="user"
              placeholder="Email"
              required
              value={formData.user_email}
              onChange={handleChange}
            />
            <textarea
              name="message"
              className="user"
              placeholder="Message"
              required
              value={formData.message}
              onChange={handleChange}
            />
            <input type="submit" value="Send" className="c-button"/>
            <span>{done && "Thanks for Contacting me"}</span>
          </form>
        </div>
      </div>


    </div>
  );
};

export default Contact;