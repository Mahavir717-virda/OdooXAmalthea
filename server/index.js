const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Company = require("./models/Company");
const User = require("./models/User");
const Expense = require("./models/Expense");
const dashboardRoutes = require("./routes/dashboard");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/expenseApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB error:", err));

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

// 🟢 Register Route
app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, password, country } = req.body;

    if (!fullName || !email || !password || !country) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // For this initial setup, the first user creates a company and becomes an admin.
    // A more robust solution would handle company invitations.
    const companyName = `${fullName}'s Company`; // Or derive from email domain, etc.
    const newCompany = new Company({
      name: companyName,
      baseCurrency: 'USD', // Placeholder, could be derived from country
      country: country
    });
    await newCompany.save();

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashed,
      country,
      role: 'admin', // First user is an admin
      companyId: newCompany._id
    });
    await user.save();

    res.json({ success: true, message: "Company and admin user registered successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


// 🔵 Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid password" });

    // (Optional) JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, "secretkey", { expiresIn: "1h" });

    res.json({ success: true, user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🧾 Create Expense
app.post('/api/expenses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { description, amount, category, date } = req.body;
    const newExpense = new Expense({
      description,
      amount,
      category,
      date,
      user: req.user.id,
      companyId: user.companyId,
      status: 'Waiting Approval' // Directly goes to waiting on creation
    });
    await newExpense.save();
    res.json({ success: true, expense: newExpense });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

// 🧾 Get User's Expenses
app.get('/api/expenses', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json({ success: true, expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.use('/api/dashboard', auth, dashboardRoutes);

app.listen(5001, () => console.log("🚀 Server running on http://localhost:5001"));
