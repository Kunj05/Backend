import React, { useState ,useRef} from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null); 
  const captchaRef=useRef();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (!captchaValue) {
        console.log("Please complete the CAPTCHA");
        return;
      }
  
      const response = await axios.post('http://localhost:8000/api/v1/signup', { email, password ,captcha: captchaValue});
      alert(response.data.message);
    } catch (error) {
      alert('Signup failed');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input type="name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <ReCAPTCHA
          sitekey="6LcuoUsqAAAAAEoi3Hj0bzLk8l2mMXqqs_3LNgIS" 
          onChange={(value) => setCaptchaValue(value)}
          ref={captchaRef}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
