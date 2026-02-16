import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "IntoTheDarknessUnafraid123!", 
  database: "jewel_foundation_database", 
});

export default pool;

