const { promisePool } = require("../config/connect");
const createError = require("../middlewares/createError");
const CryptoJS = require("crypto-js");
exports.getData = async (req, res, next) => {
  try {
    const [result] = await promisePool.query("SELECT * FROM data");
    res.json(result);
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการ query:" + err.stack);
    res.status(500).json({ error: "Query error" });
  }
};

exports.Adddata = async (req, res, next) => {
  try {
    const {
      name,
      lastname,
      bd,
      username,
      password,
      confirmpassword,
      role = 2,
    } = req.body;
    const [getdata] = await promisePool.query(
      "SELECT * FROM data where name = ? and lastname = ? and username = ?",
      [name, lastname, username]
    );
    if (getdata.length > 0) {
      return createError(400, "มีข้อมูลนี่อยู่ในระบบแล้ว");
    }
    if (password !== confirmpassword) {
      return res.status(400).json({ error: "รหัสผ่านไม่ตรงกัน" });
    }
    const hashPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    const [result] = await promisePool.query(
      "INSERT INTO data (name, lastname, bd, username, password, role) VALUES (?, ?, ?, ?, ?, ?)",
      [name, lastname, bd, username, hashPassword, role]
    );
    res.status(201).json({ message: "เพิ่มข้อมูลเรียบร้อย", result });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการ query:" + err.stack);
    res.status(500).json({ error: "Query Failed:" + err });
  }
};

exports.updateData = async (req, res, next) => {
  try {
    const {ID} = req.params
    const { name, lastname, bd, role } = req.body;
    const [user] = await promisePool.query(
      "SELECT * FROM data where ID = ? ",
      [ID]
    );
    if (user.length === 0) {
      return res.status(400).json({ error: "ไม่พบชื่อผู้ใช้งาน" });
    }
    const roleInt = role !== undefined && role !== '' ? parseInt(role, 10) : 2; // ใช้ค่าเริ่มต้น 2 ถ้าค่าว่าง
    const [result] = await promisePool.query(
      "UPDATE data set name = COALESCE(?, name), lastname = COALESCE(?,lastname), bd = COALESCE(?, bd), role = COALESCE(?) where ID = ?",
      [name, lastname, bd, roleInt, ID]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "ไม่พบชื่อผู้ใช้งาน" });
    }
    res.status(200).json({ message: "อัปเดทข้อมูลเรียบร้อย", result });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการ query:" + err.stack);
    res.status(500).json({ error: "Query Failed:" + err });
  }
};

exports.Changepwd = async (req, res, next) => {
  try {
    const { username, oldpwd, newpwd, confirmpwd } = req.body;
    const [user] = await promisePool.query(
      "SELECT * FROM data WHERE username = ? ",
      [username]
    );

    if (user.length === 0) {
      return res.status(400).json({ error: "ไม่พบชื่อผู้ใช้งาน" });
    }
    const hasholdpwd = CryptoJS.SHA256(oldpwd).toString(CryptoJS.enc.Hex);

    if (user[0].password !== hasholdpwd) {
      return res.status(400).json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
    }
    if (newpwd !== confirmpwd) {
      return res.status(400).json({ error: "รหัสผ่านไม่ตรงกัน" });
    }

    const hashnewpwd = CryptoJS.SHA256(newpwd).toString(CryptoJS.enc.Hex);

    const [result] = await promisePool.query(
      "UPDATE data set password = ? where username = ? ",
      [hashnewpwd, username]
    );
    res.status(200).json({ message: "อัปเดตรหัสผ่านเรียบร้อย", result });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการ Query:" + err.stack);
    res.status(500).json({ error: "Query Failed:" + err });
  }
};
