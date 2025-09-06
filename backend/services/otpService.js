const supabase = require('../config/supabaseClient');

const otpService = {
  // Find OTP by email
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('user_otps')
      .select('*')
      .eq('email', email)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Create or update OTP
  async createOrUpdate(email, otp) {
    // First, delete any existing OTPs for this email
    await supabase
      .from('user_otps')
      .delete()
      .eq('email', email);

    // Insert new OTP
    const { data, error } = await supabase
      .from('user_otps')
      .insert([{
        email,
        otp: otp.toString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Generate OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  },

  // Clean expired OTPs (optional cleanup function)
  async cleanExpiredOTPs() {
    const { error } = await supabase
      .from('user_otps')
      .delete()
      .lt('expires_at', new Date().toISOString());
    
    if (error) throw error;
  }
};

module.exports = otpService;