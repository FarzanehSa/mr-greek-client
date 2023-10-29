import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.scss";

const Contact = () => {
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message:"",
  });

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
      <p>
        <span className="title">Contact Us</span>
      </p>
      <p>
        <span className="title-2">General Inquiries and Customer Feedback</span>
      </p>
      <p className="line-text-prag">
        <span className="line-text">Have a question about our products?</span>
        <span className="line-text">Fill out our from and send us a note!</span>
      </p>

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
      <div className="blur c-blur-top"></div>
      <div className="blur c-blur-buttom"></div>
    </div>
  );
};

export default Contact;