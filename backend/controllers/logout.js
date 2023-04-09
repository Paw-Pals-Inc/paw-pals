const postLogout = (req, res) => {
  // perform any necessary logout logic, such as destroying session or token
  res.status(200).json({ message: "Logout successful" });
};

module.exports = postLogout;
