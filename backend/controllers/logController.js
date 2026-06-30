export const getLogs = async (req, res) => {
  try {
    return res.json({ logs: [] });
  } catch (error) {
    console.error("Logs error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};