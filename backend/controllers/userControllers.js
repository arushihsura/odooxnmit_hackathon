const userService = require("../services/userService");
const otpService = require("../services/otpService");
const nodemailer = require("nodemailer");
const supabase = require("../config/supabaseClient");

// Email config
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// User registration
exports.userregister = async (req, res) => {
    const { fname, email, password } = req.body;

    if (!fname || !email || !password) {
        return res.status(400).json({ error: "Please Enter All Input Data" });
    }

    try {
        // Validate email format
        if (!userService.validateEmail(email)) {
            return res.status(400).json({ error: "Please enter a valid email" });
        }

        // Check if user already exists
        const existingUser = await userService.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "User Already exists" });
        }

        // Create new user
        const userData = await userService.create({ fname, email, password });
        
        // Remove password from response
        const { password: _, ...userResponse } = userData;
        
        res.status(200).json(userResponse);
    } catch (error) {
        console.error("Registration error:", error);
        res.status(400).json({ error: "Invalid Details" });
    }
};

// Send OTP
exports.userOtpSend = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Please Enter Your Email" });
    }

    try {
        // Check if user exists
        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(400).json({ error: "This User Not Exist In our Db" });
        }

        // Generate OTP
        const OTP = otpService.generateOTP();

        // Save OTP to database
        await otpService.createOrUpdate(email, OTP);

        // Email template
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP for Login Verification ✔️",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 500px; margin: auto; background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h2 style="color: #333;">🔐 Email Verification</h2>
                        <p style="font-size: 16px; color: #555;">
                            Hello 👋,<br><br>
                            Your One-Time Password (OTP) for login is:
                        </p>
                        <div style="font-size: 32px; font-weight: bold; color: #007BFF; text-align: center; margin: 20px 0;">
                            ${OTP}
                        </div>
                        <p style="font-size: 14px; color: #999;">
                            This OTP is valid for 5 minutes. Do not share it with anyone.<br><br>
                            Regards,<br>
                            Team Circle
                        </p>
                    </div>
                </div>
            `
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email error:", error);
                return res.status(400).json({ error: "Email not sent" });
            } else {
                console.log("Email sent:", info.response);
                return res.status(200).json({ message: "Email sent Successfully" });
            }
        });

    } catch (error) {
        console.error("Send OTP error:", error);
        res.status(400).json({ error: "Invalid Details" });
    }
};

// User login with OTP
exports.userLogin = async (req, res) => {
    const { email, otp } = req.body;

    if (!otp || !email) {
        return res.status(400).json({ error: "Please Enter Your OTP and email" });
    }

    try {
        // Find OTP record
        const otpRecord = await otpService.findByEmail(email);
        if (!otpRecord) {
            return res.status(400).json({ error: "OTP expired or not found" });
        }

        // Verify OTP
        if (otpRecord.otp === otp) {
            // Find user
            const user = await userService.findByEmail(email);
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }

            // Generate token
            const token = await userService.generateAuthToken(user.id);

            // Clean up used OTP
            await supabase
                .from('user_otps')
                .delete()
                .eq('email', email);

            res.status(200).json({
                message: "User Login Successfully Done",
                userToken: token,
                user: {
                    id: user.id,
                    fname: user.fname,
                    email: user.email
                }
            });
        } else {
            res.status(400).json({ error: "Invalid OTP" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(400).json({ error: "Invalid Details" });
    }
};