// Remove MongoDB connection
// const mongoose = require("mongoose");
// const DB = process.env.DATABASE;
// mongoose.connect(DB, { ... });

// Supabase connection is handled by the client
const supabase = require('./supabaseClient');

// Optional: Test connection
const testConnection = async () => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
        
        if (error) throw error;
        console.log('✅ Supabase connection successful');
    } catch (error) {
        console.error('❌ Supabase connection failed:', error);
    }
};

module.exports = { supabase, testConnection };