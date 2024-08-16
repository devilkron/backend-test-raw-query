const { promisePool } = require("../config/connect");
const createError = require("../middlewares/createError");

exports.AddRoles = async (req, res, next) => {
  try {
    const { role_name } = req.body;
    // ใช้ promise-based query
    const [get] = await promisePool.query(
      "SELECT * FROM role where role_name = (?)",
      [role_name]
    );
    if (get.length !== 0) {
      return createError(400, "มีRoleนี้อยู่แล้ว");
    }
    // console.log(get.length)
      const [result] = await promisePool.query(
        `INSERT INTO role (role_name) VALUES (?)`,
        [role_name]
      );
      res.status(201).json({ message: "Role added successfully", result });
    
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการ query: " + err.stack);
    res.status(500).json({ error: "Query error" });
  }
};

exports.getRoles = async (req, res, next) => {
  try {
    // ใช้ promise-based query
    const [result] = await promisePool.query("SELECT * FROM role");
    res.json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการ query: " + err.stack);
    res.status(500).json({ error: "Query error" });
  }
};
