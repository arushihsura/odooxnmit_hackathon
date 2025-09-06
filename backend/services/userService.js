const supabase = require('../config/supabaseClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userService = {
  // Find user by email
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Create new user
  async create(userData) {
    const { fname, email, password } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        fname,
        email,
        password: hashedPassword
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Generate auth token
  async generateAuthToken(userId) {
    const token = jwt.sign(
      { _id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Store token in database
    const { error } = await supabase
      .from('user_tokens')
      .insert([{
        user_id: userId,
        token
      }]);
    
    if (error) throw error;
    return token;
  },

  // Validate email
  validateEmail(email) {
    return validator.isEmail(email);
  }
};

module.exports = userService;