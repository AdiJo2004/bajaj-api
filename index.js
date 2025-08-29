require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const FULL_NAME_LOWER = process.env.FULL_NAME_LOWER     
const DOB_DDMMYYYY    = process.env.DOB_DDMMYYYY      
const EMAIL           = process.env.EMAIL           
const ROLL_NUMBER     = process.env.ROLL_NUMBER     


function isNumericString(s) {
  return /^[+-]?\d+$/.test(s);
}
function isAlphaString(s) {
  return /^[A-Za-z]+$/.test(s);
}

app.post("/bfhl", (req, res) => {
  try {
    const data = req.body?.data;
    if (!Array.isArray(data)) {
      return res.status(200).json({
        is_success: false,
        user_id: `${FULL_NAME_LOWER}_${DOB_DDMMYYYY}`,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
        error: "Request body must be { data: [ ... ] }",
      });
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    const letters = []; 

    let sum = 0;

    for (const item of data) {
      const s = String(item);

      const chars = s.match(/[A-Za-z]/g);
      if (chars) letters.push(...chars);

      if (isNumericString(s)) {
        const n = parseInt(s, 10);
        (Math.abs(n) % 2 === 0 ? even_numbers : odd_numbers).push(s); // return numbers as strings
        sum += n;
      } else if (isAlphaString(s)) {
        alphabets.push(s.toUpperCase());
      } else {
        special_characters.push(s);
      }
    }

    letters.reverse();
    const concat_string = letters
      .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join("");

    return res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME_LOWER}_${DOB_DDMMYYYY}`, // full_name_ddmmyyyy
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum), 
      concat_string,
    });
  } catch (e) {
    return res.status(200).json({
      is_success: false,
      user_id: `${FULL_NAME_LOWER}_${DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: "Unexpected server error",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on :${PORT}`));
