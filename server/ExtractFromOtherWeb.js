import React, { useRef, useState } from "react";
import axios from 'axios';
import constants from "../constants";
import cheerio from 'cheerio';

/*
I can't get this to work. I made it work in BrowserScreen. But refactoring the code to get this async function
in this file was difficult.
*/


// const [loading, setLoading] = useState(false);
// const [error, setError] = useState('');

// const ExtractFromOtherWeb = async ()=> {

//   const [test, setTest] = useState('');
//   console.log("running");
//   // setLoading(true);
//   // setError('');
//   try {
//     const response = await axios.get(constants.URL.RECIPE);
//     const loadedData = cheerio.load(response.data);
//     let doc = loadedData('body').text().replace(/\s+/g, ' ').trim();
//     setTest(doc);
//   } catch (err) {
//     // setError(err.message);
//     console.log("error has occured: "+error);
//     console.log(err);
//   }
//   //setLoading(false);
//   return text;
// };

// export default ExtractFromOtherWeb;

