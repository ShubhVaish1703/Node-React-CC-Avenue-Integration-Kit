import React from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function App() {
  const [encRequest, setEncRequest] = React.useState("");
  let accessCode = "" || process.env.CCAVENUE_ACCESS_CODE
  let email = "john.doe@gmail.com"

  const formRef = React.useRef(null);

  const onSubmit = async () => {
    const payload = {
      email,
      redirect_url: `${API_URL}/handle-response`,
      cancel_url: `http://localhost:3000`,
    };

    try {
      const encryptionRes = await axios.get(`${API_URL}/encrypt`, {
        params: {
          payload,
        },
      });

      console.log("Encrypted Data", encryptionRes);

      if (encryptionRes.status === 200) {
        const encryptedData = encryptionRes.data.data;
        setEncRequest(encryptedData);
        setTimeout(async () => {
          await formRef.current.submit();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <form
        ref={formRef}
        id="nonseamless"
        method="post"
        name="redirect"
        action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"
      >
        <input
          type="hidden"
          id="encRequest"
          name="encRequest"
          value={encRequest}
        ></input>
        <input
          type="hidden"
          name="access_code"
          id="access_code"
          value={accessCode}
        ></input>
      </form>
      <button onClick={onSubmit}>PAY NOW</button>
    </div>
  );
}

export default App;
